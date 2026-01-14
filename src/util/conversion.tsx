export function convertMicroDenomToDenom(amount: number | string) {
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  amount = amount / 1000000
  return isNaN(amount) ? 0 : amount
}

export function convertDenomToMicroDenom(amount: number | string): string {
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  amount = amount * 1000000
  return isNaN(amount) ? '0' : String(amount)
}

export function convertFromMicroDenom(denom: string) {
  return denom?.substring(1).toUpperCase()
}

export function convertToFixedDecimals(amount: number | string): string {
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  if (amount > 0.01) {
    return amount.toFixed(2)
  } else return String(amount)
}

export const zeroVotingCoin = {
  amount: '0',
  denom: 'ucredits',
}

export const zeroStakingCoin = {
  amount: '0',
  denom: import.meta.env.VITE_STAKING_DENOM || 'ujuno',
}

export const getExplorerUrl = (chainId: string, txHash: string): string => {
  // Map chain IDs to their explorer URLs
  const explorerMap: Record<string, string> = {
    'phoenix-1': 'https://chainsco.pe/terra2/tx/',
    'pisco-1': 'https://chainsco.pe/terra2-testnet/tx/',
    'juno-1': 'https://www.mintscan.io/juno/txs/',
    'uni-6': 'https://www.mintscan.io/juno-testnet/txs/',
  }

  const baseUrl = explorerMap[chainId] || 'https://chainsco.pe/terra2/tx/'
  return `${baseUrl}${txHash}`
}

export const getAddressExplorerUrl = (
  chainId: string,
  address: string
): string => {
  // Map chain IDs to their explorer URLs for addresses
  const explorerMap: Record<string, string> = {
    'phoenix-1': 'https://chainsco.pe/terra2/address/',
    'pisco-1': 'https://chainsco.pe/terra2-testnet/address/',
    'juno-1': 'https://www.mintscan.io/juno/address/',
    'uni-6': 'https://www.mintscan.io/juno-testnet/address/',
  }

  const baseUrl = explorerMap[chainId] || 'https://chainsco.pe/terra2/address/'
  return `${baseUrl}${address}`
}

export const shortenAddress = (address: string): string => {
  if (!address || address.length < 13) return address
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}
