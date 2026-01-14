import WalletLoader from 'components/WalletLoader'
import { useSigningClient } from 'contexts/cosmwasm'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProposalCard from 'components/ProposalCard'
import { ProposalListResponse, ProposalResponse, Timestamp } from 'types/cw3'
import { getAddressExplorerUrl, shortenAddress } from 'util/conversion'
import { ExternalLink } from 'lucide-react'

const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || 'phoenix-1'

// TODO: review union Expiration from types/cw3
type Expiration = {
  at_time: Timestamp
}

const MultisigDetail = () => {
  const { multisigAddress } = useParams<{ multisigAddress: string }>()
  const navigate = useNavigate()

  const { walletAddress, signingClient } = useSigningClient()
  const [reversedProposals, setReversedProposals] = useState<
    ProposalResponse[]
  >([])
  const [hideLoadMore, setHideLoadMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [startBefore, setStartBefore] = useState<number | null>(null)

  useEffect(() => {
    if (walletAddress.length === 0 || !signingClient || !multisigAddress) {
      setReversedProposals([])
      setHideLoadMore(false)
      return
    }
    setLoading(true)
    signingClient
      .queryContractSmart(multisigAddress, {
        reverse_proposals: {
          ...(startBefore && { start_before: startBefore }),
          limit: 10,
        },
      })
      .then((response: ProposalListResponse) => {
        if (response.proposals.length < 10) {
          setHideLoadMore(true)
        }
        setReversedProposals(reversedProposals.concat(response.proposals))
      })
      .then(() => setLoading(false))
      .catch((err: any) => {
        setLoading(false)
        console.log('err', err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, signingClient, multisigAddress, startBefore])

  return (
    <WalletLoader loading={reversedProposals.length === 0 && loading}>
      <div className="flex flex-col w-96 lg:w-6/12 max-w-full px-2 py-4">
        {multisigAddress && (
          <div className="mb-4 flex items-center gap-2 text-muted-foreground text-sm">
            <span className="font-mono">{shortenAddress(multisigAddress)}</span>
            <a
              href={getAddressExplorerUrl(CHAIN_ID, multisigAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
              title="View on Explorer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
        <div className="flex flex-row justify-between items-center mb-4">
          <h1 className="text-lg font-bold sm:text-3xl text-foreground">
            Proposals
          </h1>
          <button
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
            onClick={() =>
              navigate(`/${encodeURIComponent(multisigAddress!)}/create`)
            }
          >
            + Create
          </button>
        </div>
      </div>
      <div className="w-96 lg:w-6/12 max-w-full">
        {reversedProposals.length === 0 && (
          <div className="text-center text-muted-foreground">
            No proposals found, please create a proposal.
          </div>
        )}
        {reversedProposals.map((proposal) => {
          const { title, id, status } = proposal
          const expires = proposal.expires as Expiration

          return (
            <ProposalCard
              key={id}
              title={title}
              id={`${id}`}
              status={status}
              expires_at={parseInt(expires.at_time)}
              multisigAddress={multisigAddress!}
            />
          )
        })}
        {!hideLoadMore && (
          <button
            className="px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg w-full mt-2 rounded-lg transition-colors font-semibold"
            onClick={() => {
              const proposal = reversedProposals[reversedProposals.length - 1]
              setStartBefore(proposal.id)
            }}
          >
            Load More
          </button>
        )}
      </div>
      <div></div>
    </WalletLoader>
  )
}

export default MultisigDetail
