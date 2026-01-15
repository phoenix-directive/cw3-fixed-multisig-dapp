import WalletLoader from 'components/WalletLoader'
import { useSigningClient } from 'contexts/cosmwasm'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LineAlert from 'components/LineAlert'
import { VoteInfo, ProposalResponse } from 'types/cw3'
import {
  getExplorerUrl,
  getAddressExplorerUrl,
  shortenAddress,
} from 'util/conversion'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import { getMemberName } from 'util/recentMultisigs'

const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || 'phoenix-1'

function VoteButtons({
  onVoteYes = () => {},
  onVoteNo = () => {},
  onBack = (_e: any) => {},
  votes = [],
  walletAddress = '',
  status = '',
}) {
  const [vote]: VoteInfo[] = votes.filter(
    (v: VoteInfo) => v.voter === walletAddress
  )

  if (vote) {
    const variant =
      vote.vote === 'yes' ? 'success' : vote.vote === 'no' ? 'error' : 'error'
    const msg = `You voted ${vote.vote}`
    return (
      <>
        <LineAlert className="mt-2" variant={variant} msg={msg} />
        {status === 'open' && (
          <button
            className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-semibold my-4 flex items-center justify-center gap-1"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" />
            Proposals
          </button>
        )}
      </>
    )
  }
  if (status !== 'open') {
    return null
  }
  return (
    <div className="flex justify-between content-center mt-2 gap-2">
      <button
        className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-semibold flex items-center justify-center gap-1"
        onClick={onBack}
      >
        <ChevronLeft className="h-4 w-4" />
        Proposals
      </button>

      <button
        className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold"
        onClick={onVoteYes}
      >
        Sign
      </button>
      <button
        className="px-6 py-3 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors font-semibold"
        onClick={onVoteNo}
      >
        Reject
      </button>
    </div>
  )
}

const ProposalDetail = () => {
  const { multisigAddress, proposalId } = useParams<{
    multisigAddress: string
    proposalId: string
  }>()
  const navigate = useNavigate()

  const { walletAddress, signingClient } = useSigningClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [proposal, setProposal] = useState<ProposalResponse | null>(null)
  const [votes, setVotes] = useState([])
  const [voters, setVoters] = useState<Array<{ addr: string; weight: number }>>(
    []
  )
  const [timestamp, setTimestamp] = useState(new Date())
  const [transactionHash, setTransactionHash] = useState('')

  useEffect(() => {
    if (
      walletAddress.length === 0 ||
      !signingClient ||
      !multisigAddress ||
      !proposalId
    ) {
      return
    }
    setLoading(true)
    Promise.all([
      signingClient.queryContractSmart(multisigAddress, {
        proposal: { proposal_id: parseInt(proposalId) },
      }),
      signingClient.queryContractSmart(multisigAddress, {
        list_votes: { proposal_id: parseInt(proposalId) },
      }),
      signingClient.queryContractSmart(multisigAddress, {
        list_voters: {},
      }),
    ])
      .then((values) => {
        const [proposal, { votes }, { voters }] = values
        setProposal(proposal)
        setVotes(votes)
        setVoters(voters)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        setError(err.message)
      })
  }, [walletAddress, signingClient, multisigAddress, proposalId, timestamp])

  const handleVote = async (vote: string) => {
    signingClient
      ?.execute(
        walletAddress,
        multisigAddress!,
        {
          vote: { proposal_id: parseInt(proposalId!), vote },
        },
        'auto'
      )
      .then((response) => {
        setTimestamp(new Date())
        setTransactionHash(response.transactionHash)
      })
      .catch((err) => {
        setLoading(false)
        setError(err.message)
      })
  }

  const handleExecute = async () => {
    setError('')
    signingClient
      ?.execute(
        walletAddress,
        multisigAddress!,
        {
          execute: { proposal_id: parseInt(proposalId!) },
        },
        'auto'
      )
      .then((response) => {
        setTimestamp(new Date())
        setTransactionHash(response.transactionHash)
      })
      .catch((err) => {
        setLoading(false)
        setError(err.message)
      })
  }

  const handleClose = async () => {
    setError('')
    signingClient
      ?.execute(
        walletAddress,
        multisigAddress!,
        {
          close: { proposal_id: parseInt(proposalId!) },
        },
        'auto'
      )
      .then((response) => {
        setTimestamp(new Date())
        setTransactionHash(response.transactionHash)
      })
      .catch((err) => {
        setLoading(false)
        setError(err.message)
      })
  }

  return (
    <WalletLoader loading={loading}>
      <div className="flex justify-center w-full text-left">
        <div className="flex flex-col w-full max-w-3xl px-2 py-4">
          {!proposal ? (
            <div className="text-center m-8 text-muted-foreground">
              No proposal with that ID found.
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6 text-foreground">
                {proposal.title}
              </h1>
              <p className="mb-8 text-foreground whitespace-pre-wrap">
                {proposal.description}
              </p>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2 text-foreground">
                  Messages
                </h2>
                <div className="p-4 border border-border bg-card rounded-lg mb-8 overflow-x-auto">
                  <pre className="text-sm font-mono">
                    <code
                      dangerouslySetInnerHTML={{
                        __html: JSON.stringify(proposal.msgs, null, 1)
                          .replace(
                            /"([^"]+)":/g,
                            '<span class="text-blue-600 dark:text-blue-400">"$1"</span>:'
                          )
                          .replace(
                            /: "([^"]*)"/g,
                            ': <span class="text-green-600 dark:text-green-400">"$1"</span>'
                          )
                          .replace(
                            /: (true|false|null)/g,
                            ': <span class="text-purple-600 dark:text-purple-400">$1</span>'
                          )
                          .replace(
                            /: (\d+)/g,
                            ': <span class="text-orange-600 dark:text-orange-400">$1</span>'
                          ),
                      }}
                    ></code>
                  </pre>
                </div>
              </div>

              {/* Votes section */}
              {(votes.length > 0 || voters.length > 0) && (
                <div className="mb-6 p-4 bg-card border border-border rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Votes
                  </h3>
                  <div className="space-y-2">
                    {votes.map((vote: VoteInfo) => {
                      const memberName = getMemberName(vote.voter)
                      const voteColor =
                        vote.vote === 'yes'
                          ? 'text-green-600 dark:text-green-400'
                          : vote.vote === 'no'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-muted-foreground'

                      return (
                        <div
                          key={vote.voter}
                          className="flex items-center justify-between gap-2 text-sm"
                        >
                          <div className="flex-1 flex items-center gap-2">
                            <a
                              href={getAddressExplorerUrl(CHAIN_ID, vote.voter)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                            >
                              {shortenAddress(vote.voter)}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            {memberName && (
                              <span className="font-medium text-foreground">
                                {memberName}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-semibold uppercase ${voteColor}`}
                            >
                              {vote.vote}
                            </span>
                            <span className="text-muted-foreground">
                              Weight: {vote.weight}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                    {voters
                      .filter(
                        (voter) =>
                          !votes.find((v: VoteInfo) => v.voter === voter.addr)
                      )
                      .map((voter) => {
                        const memberName = getMemberName(voter.addr)
                        return (
                          <div
                            key={voter.addr}
                            className="flex items-center justify-between gap-2 text-sm opacity-50"
                          >
                            <div className="flex-1 flex items-center gap-2">
                              <a
                                href={getAddressExplorerUrl(
                                  CHAIN_ID,
                                  voter.addr
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                              >
                                {shortenAddress(voter.addr)}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                              {memberName && (
                                <span className="font-medium text-foreground">
                                  {memberName}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground italic">
                                Not voted
                              </span>
                              <span className="text-muted-foreground">
                                Weight: {voter.weight}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              <VoteButtons
                onVoteYes={handleVote.bind(null, 'yes')}
                onVoteNo={handleVote.bind(null, 'no')}
                onBack={(e) => {
                  e.preventDefault()
                  navigate(`/${multisigAddress}`)
                }}
                votes={votes}
                walletAddress={walletAddress}
                status={proposal.status}
              />

              {error && (
                <LineAlert className="mt-2" variant="error" msg={error} />
              )}

              {transactionHash.length > 0 && (
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
                </div>
              )}

              {proposal.status !== 'open' && (
                <div className="flex justify-between content-center my-8 gap-2">
                  <button
                    className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-semibold flex items-center justify-center gap-1"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(`/${multisigAddress}`)
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Proposals
                  </button>
                  {proposal.status === 'passed' && (
                    <button
                      className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold"
                      onClick={handleExecute}
                    >
                      Execute
                    </button>
                  )}
                  {proposal.status === 'rejected' && (
                    <button
                      className="px-6 py-3 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors font-semibold"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </WalletLoader>
  )
}

export default ProposalDetail
