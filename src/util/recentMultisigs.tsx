export interface RecentMultisig {
  address: string
  name?: string
  lastAccessed: number
}

const RECENT_KEY = 'recentMultisigs'
const NAMES_KEY = 'multisigNames'
const MEMBER_NAMES_KEY = 'memberNames'
const MAX_RECENT = 5

export function getRecentMultisigs(): RecentMultisig[] {
  try {
    const stored = localStorage.getItem(RECENT_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function addRecentMultisig(address: string): void {
  const recents = getRecentMultisigs()
  const existing = recents.find((r) => r.address === address)

  if (existing) {
    // Update timestamp and move to front
    existing.lastAccessed = Date.now()
    const filtered = recents.filter((r) => r.address !== address)
    localStorage.setItem(RECENT_KEY, JSON.stringify([existing, ...filtered]))
  } else {
    // Add new entry
    const newRecent: RecentMultisig = {
      address,
      name: getMultisigName(address),
      lastAccessed: Date.now(),
    }
    const updated = [newRecent, ...recents].slice(0, MAX_RECENT)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  }
}

export function getMultisigName(address: string): string | undefined {
  try {
    const stored = localStorage.getItem(NAMES_KEY)
    if (!stored) return undefined
    const names = JSON.parse(stored)
    return names[address]
  } catch {
    return undefined
  }
}

export function setMultisigName(address: string, name: string): void {
  try {
    const stored = localStorage.getItem(NAMES_KEY) || '{}'
    const names = JSON.parse(stored)
    names[address] = name
    localStorage.setItem(NAMES_KEY, JSON.stringify(names))

    // Update the name in recents too
    const recents = getRecentMultisigs()
    const existing = recents.find((r) => r.address === address)
    if (existing) {
      existing.name = name
      localStorage.setItem(RECENT_KEY, JSON.stringify(recents))
    }
  } catch (error) {
    console.error('Failed to set multisig name', error)
  }
}

export function getMemberName(memberAddress: string): string | undefined {
  try {
    const stored = localStorage.getItem(MEMBER_NAMES_KEY)
    if (!stored) return undefined
    const names = JSON.parse(stored)
    return names[memberAddress]
  } catch {
    return undefined
  }
}

export function setMemberName(memberAddress: string, name: string): void {
  try {
    const stored = localStorage.getItem(MEMBER_NAMES_KEY) || '{}'
    const names = JSON.parse(stored)
    names[memberAddress] = name
    localStorage.setItem(MEMBER_NAMES_KEY, JSON.stringify(names))
  } catch (error) {
    console.error('Failed to set member name', error)
  }
}
