/**
 * Rewards Service - CAS Tokens (Cyber Ad Space)
 *
 * Token-ready architecture: this module abstracts the rewards/token system
 * behind an interface. Currently uses local state + localStorage.
 * CAS is a coin already created on the XPR Blockchain.
 * When ready, swap the implementation to read on-chain CAS balance.
 *
 * Future XPR integration point: replace RewardsProvider with one that uses
 * @proton/web-sdk to read on-chain CAS token balance and submit transfer actions.
 */

export interface RewardsAction {
  type: 'purchase' | 'scan' | 'create_song' | 'referral' | 'signup'
  description: string
  points: number
}

export interface RewardsTransaction {
  id: string
  action: RewardsAction
  timestamp: number
  metadata?: Record<string, string>
}

export interface RewardsState {
  balance: number
  transactions: RewardsTransaction[]
  isAuthenticated: boolean
}

/** Points earned per action */
export const REWARDS_RULES: RewardsAction[] = [
  { type: 'purchase', description: 'Make a purchase', points: 100 },
  { type: 'scan', description: 'Scan a QR code on the Cybertruck', points: 50 },
  { type: 'create_song', description: 'Create a custom song', points: 75 },
  { type: 'referral', description: 'Refer a friend', points: 150 },
  { type: 'signup', description: 'Create an account', points: 25 },
]

const STORAGE_KEY = 'cyberadspace_rewards'

function loadState(): RewardsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as RewardsState
  } catch {
    /* ignore */
  }
  return { balance: 0, transactions: [], isAuthenticated: false }
}

function saveState(state: RewardsState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

/**
 * IRewardsService - interface that can be swapped for XPR Network later.
 */
export interface IRewardsService {
  getState(): RewardsState
  addPoints(action: RewardsAction, metadata?: Record<string, string>): RewardsTransaction
  getBalance(): number
  getTransactions(): RewardsTransaction[]
  reset(): void
}

/**
 * LocalRewardsService - localStorage-based implementation.
 * Replace with XPRRewardsService when blockchain integration is ready.
 */
export class LocalRewardsService implements IRewardsService {
  private state: RewardsState

  constructor() {
    this.state = loadState()
  }

  getState(): RewardsState {
    return { ...this.state }
  }

  addPoints(action: RewardsAction, metadata?: Record<string, string>): RewardsTransaction {
    const tx: RewardsTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      action,
      timestamp: Date.now(),
      metadata,
    }
    this.state.balance += action.points
    this.state.transactions.push(tx)
    saveState(this.state)
    return tx
  }

  getBalance(): number {
    return this.state.balance
  }

  getTransactions(): RewardsTransaction[] {
    return [...this.state.transactions]
  }

  reset(): void {
    this.state = { balance: 0, transactions: [], isAuthenticated: false }
    saveState(this.state)
  }
}

/** Singleton instance */
export const rewardsService: IRewardsService = new LocalRewardsService()
