import WalletLoader from 'components/WalletLoader'
import { useSigningClient } from 'contexts/cosmwasm'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProposalCard from 'components/ProposalCard'
import { ProposalListResponse, ProposalResponse, Timestamp } from 'types/cw3'
import { getAddressExplorerUrl, shortenAddress } from 'util/conversion'
import { ExternalLink, Edit2, Check, X } from 'lucide-react'
import {
  addRecentMultisig,
  getMultisigName,
  setMultisigName,
  getMemberName,
  setMemberName,
} from 'util/recentMultisigs'

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
  const [voters, setVoters] = useState<Array<{ addr: string; weight: number }>>(
    []
  )
  const [multisigName, setMultisigNameState] = useState<string>('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [editNameValue, setEditNameValue] = useState('')
  const [editingMemberAddress, setEditingMemberAddress] = useState<
    string | null
  >(null)
  const [editMemberNameValue, setEditMemberNameValue] = useState('')
  const [memberNames, setMemberNames] = useState<Record<string, string>>({})

  useEffect(() => {
    if (multisigAddress) {
      addRecentMultisig(multisigAddress)
      const name = getMultisigName(multisigAddress)
      setMultisigNameState(name || '')
      setEditNameValue(name || '')
    }
  }, [multisigAddress])

  useEffect(() => {
    if (walletAddress.length === 0 || !signingClient || !multisigAddress) {
      setReversedProposals([])
      setHideLoadMore(false)
      return
    }
    setLoading(true)

    // Query voters
    signingClient
      .queryContractSmart(multisigAddress, { list_voters: {} })
      .then((response: { voters: Array<{ addr: string; weight: number }> }) => {
        // Sort by weight descending
        const sortedVoters = response.voters.sort((a, b) => b.weight - a.weight)
        setVoters(sortedVoters)
        // Load member names
        const names: Record<string, string> = {}
        sortedVoters.forEach((voter) => {
          const name = getMemberName(voter.addr)
          if (name) names[voter.addr] = name
        })
        setMemberNames(names)
      })
      .catch((err: any) => {
        console.log('Failed to load voters:', err)
      })

    // Query proposals
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

  const handleSaveName = () => {
    if (multisigAddress && editNameValue.trim()) {
      setMultisigName(multisigAddress, editNameValue.trim())
      setMultisigNameState(editNameValue.trim())
    }
    setIsEditingName(false)
  }

  const handleCancelEdit = () => {
    setEditNameValue(multisigName)
    setIsEditingName(false)
  }

  const handleEditMember = (address: string) => {
    setEditingMemberAddress(address)
    setEditMemberNameValue(memberNames[address] || '')
  }

  const handleSaveMemberName = () => {
    if (editingMemberAddress && editMemberNameValue.trim()) {
      setMemberName(editingMemberAddress, editMemberNameValue.trim())
      setMemberNames({
        ...memberNames,
        [editingMemberAddress]: editMemberNameValue.trim(),
      })
    }
    setEditingMemberAddress(null)
    setEditMemberNameValue('')
  }

  const handleCancelMemberEdit = () => {
    setEditingMemberAddress(null)
    setEditMemberNameValue('')
  }

  return (
    <WalletLoader loading={reversedProposals.length === 0 && loading}>
      <div className="flex flex-col w-full max-w-3xl px-2 py-4">
        {multisigAddress && (
          <>
            {/* Name section */}
            <div className="mb-4">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editNameValue}
                    onChange={(e) => setEditNameValue(e.target.value)}
                    className="flex-1 px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    placeholder="Multisig name..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName()
                      if (e.key === 'Escape') handleCancelEdit()
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-2 text-green-600 hover:text-green-700 transition-colors"
                    title="Save"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors"
                    title="Cancel"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {multisigName ? (
                    <h2 className="text-2xl font-bold text-foreground">
                      {multisigName}
                    </h2>
                  ) : (
                    <h2 className="text-xl font-semibold text-muted-foreground italic">
                      Unnamed Multisig
                    </h2>
                  )}
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit name"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Address section */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground font-mono">
                {shortenAddress(multisigAddress)}
              </div>
              <a
                href={getAddressExplorerUrl(CHAIN_ID, multisigAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                title="View on Explorer"
              >
                <span className="text-sm">View</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Voters section */}
            {voters.length > 0 && (
              <div className="mb-6 p-4 bg-card border border-border rounded-lg">
                {/* <h3 className="text-lg font-semibold text-foreground mb-3">
                  Members
                </h3> */}
                <div className="space-y-2">
                  {voters.map((voter) => (
                    <div
                      key={voter.addr}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      {editingMemberAddress === voter.addr ? (
                        <>
                          <input
                            type="text"
                            value={editMemberNameValue}
                            onChange={(e) =>
                              setEditMemberNameValue(e.target.value)
                            }
                            className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary text-foreground"
                            placeholder="Member name..."
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveMemberName()
                              if (e.key === 'Escape') handleCancelMemberEdit()
                            }}
                          />
                          <button
                            onClick={handleSaveMemberName}
                            className="p-1 text-green-600 hover:text-green-700 transition-colors"
                            title="Save"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancelMemberEdit}
                            className="p-1 text-red-600 hover:text-red-700 transition-colors"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex-1 flex items-center gap-2">
                            <a
                              href={getAddressExplorerUrl(CHAIN_ID, voter.addr)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                            >
                              {shortenAddress(voter.addr)}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            <button
                              onClick={() => handleEditMember(voter.addr)}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              title="Edit member name"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            {memberNames[voter.addr] && (
                              <span className="font-medium text-foreground">
                                {memberNames[voter.addr]}
                              </span>
                            )}
                          </div>
                          <span className="text-muted-foreground">
                            Weight: {voter.weight}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div className="flex flex-row justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-foreground">Proposals</h1>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm"
            onClick={() =>
              navigate(`/${encodeURIComponent(multisigAddress!)}/create`)
            }
          >
            + Create
          </button>
        </div>
      </div>
      <div className="w-full max-w-3xl">
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
