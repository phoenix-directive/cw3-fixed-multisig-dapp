import WalletLoader from 'components/WalletLoader'
import { useSigningClient } from 'contexts/cosmwasm'
import { useState, FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LineAlert from 'components/LineAlert'
import cloneDeep from 'lodash.clonedeep'
import { getExplorerUrl } from 'util/conversion'

const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || 'phoenix-1'

interface FormElements extends HTMLFormControlsCollection {
  label: HTMLInputElement
  description: HTMLInputElement
  json: HTMLInputElement
}

interface ProposalFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

function validateJsonMsg(json: any) {
  if (typeof json !== 'object' || json === null) {
    return false
  }
  // Allow direct CosmWasm message format (array of messages)
  if (Array.isArray(json)) {
    return (
      json.length > 0 &&
      json.every((msg) => typeof msg === 'object' && msg !== null)
    )
  }
  // Allow Cosmos SDK transaction format with body.messages
  if (json?.body?.messages && Array.isArray(json.body.messages)) {
    return json.body.messages.length > 0
  }
  return false
}

const MultisigCreateProposal = () => {
  const { multisigAddress } = useParams<{ multisigAddress: string }>()
  const navigate = useNavigate()
  const { walletAddress, signingClient } = useSigningClient()
  const [transactionHash, setTransactionHash] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [proposalID, setProposalID] = useState('')

  const handleSubmit = (event: FormEvent<ProposalFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const currentTarget = event.currentTarget as ProposalFormElement

    const title = currentTarget.label.value.trim()
    const description = currentTarget.description.value.trim()
    const jsonStr = currentTarget.json.value.trim()

    if (
      title.length === 0 ||
      description.length === 0 ||
      jsonStr.length === 0
    ) {
      setLoading(false)
      setError('All fields are required.')
      return
    }

    // clone json string to avoid prototype poisoning
    // https://medium.com/intrinsic-blog/javascript-prototype-poisoning-vulnerabilities-in-the-wild-7bc15347c96
    const jsonClone = cloneDeep(jsonStr)
    let json
    try {
      json = JSON.parse(jsonClone)
    } catch (e) {
      setLoading(false)
      setError('Invalid JSON format.')
      return
    }

    if (!validateJsonMsg(json)) {
      setLoading(false)
      setError('Error in JSON message format.')
      return
    }

    // Handle direct CosmWasm message format (array of messages)
    let msgs
    if (Array.isArray(json)) {
      msgs = json
    } else if (json?.body?.messages) {
      // Handle Cosmos SDK transaction format
      msgs = json.body.messages.map((message: any) => {
        if (message['@type'] === '/cosmos.bank.v1beta1.MsgSend') {
          return { bank: { send: message } }
        }
        // For other message types, pass through as-is
        return message
      })
    } else {
      setLoading(false)
      setError('Unable to parse message format.')
      return
    }

    const msg = {
      title,
      description,
      msgs,
    }

    signingClient
      ?.execute(walletAddress, multisigAddress!, { propose: msg }, 'auto')
      .then((response) => {
        setLoading(false)
        setTransactionHash(response.transactionHash)

        // In newer versions of @cosmjs, use response.events directly
        const wasmEvent = response.events?.find((e) => e.type === 'wasm')
        const proposalIdAttr = wasmEvent?.attributes.find(
          (attr) => attr.key === 'proposal_id'
        )

        if (proposalIdAttr) {
          setProposalID(proposalIdAttr.value)
        }
      })
      .catch((e) => {
        setLoading(false)
        setError(e.message)
      })
  }

  const complete = transactionHash.length > 0

  return (
    <WalletLoader>
      <div className="flex flex-col w-full">
        <div className="grid place-items-center">
          <form
            className="text-left container mx-auto max-w-lg"
            onSubmit={handleSubmit}
          >
            <h1 className="text-4xl my-8 font-bold text-foreground">
              Create Proposal
            </h1>
            <label className="block text-foreground font-medium mb-2">
              Title
            </label>
            <input
              className="rounded-lg box-border p-3 w-full bg-card border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-xl transition-all"
              name="label"
              readOnly={complete}
            />
            <label className="block mt-4 text-foreground font-medium mb-2">
              Description
            </label>
            <textarea
              className="rounded-lg box-border p-3 h-24 w-full bg-card border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-xl transition-all"
              name="description"
              readOnly={complete}
            />
            <label className="block mt-4 text-foreground font-medium mb-2">
              JSON
            </label>
            <textarea
              className="rounded-lg box-border p-3 w-full font-mono h-80 bg-card border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-base transition-all"
              cols={7}
              name="json"
              readOnly={complete}
            />
            {!complete && (
              <button
                className={`px-6 py-3 bg-primary text-primary-foreground text-lg mt-8 ml-auto rounded-lg hover:bg-primary/90 transition-all font-semibold ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Proposal'}
              </button>
            )}
            {error && (
              <div className="mt-8">
                <LineAlert variant="error" msg={error} />
              </div>
            )}

            {proposalID.length > 0 && (
              <div className="mt-8">
                <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-300">
                  <div className="font-semibold mb-2">Success!</div>
                  <div className="text-sm">
                    Transaction:{' '}
                    <a
                      href={getExplorerUrl(CHAIN_ID, transactionHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-green-600 dark:hover:text-green-300 break-all"
                    >
                      {transactionHash}
                    </a>
                  </div>
                </div>
                <button
                  className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(`/${multisigAddress}/${proposalID}`)
                  }}
                >
                  View Proposal &#8599;
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </WalletLoader>
  )
}

export default MultisigCreateProposal
