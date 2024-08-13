import { subscribeKey as subKey } from 'valtio/vanilla/utils'
import { proxy, ref, subscribe as sub } from 'valtio/vanilla'
import type { W3mFrameTypes } from '@web3modal/wallet'
import UniversalProvider from '@walletconnect/universal-provider'

// -- Types --------------------------------------------- //

export type Status = 'reconnecting' | 'connected' | 'disconnected'

export type Network = {
  id: string
  imageId: string | undefined
  chainId: string | number
  chain: 'evm' | 'solana'
  name: string
  currency: string
  explorerUrl: string
  rpcUrl: string
}

export interface WcStoreUtilState {
  provider?: UniversalProvider
  providerType?: 'walletConnect' | 'injected' | 'eip' | 'announced'
  address?: string
  chainId?: number
  caipChainId?: string
  currentChain?: 'evm' | 'solana'
  currentNetwork?: Network
  error?: unknown
  preferredAccountType?: W3mFrameTypes.AccountType
  status: Status
  isConnected: boolean
  chains: string[]
}

type StateKey = keyof WcStoreUtilState

// -- State --------------------------------------------- //
const state = proxy<WcStoreUtilState>({
  provider: undefined,
  providerType: undefined,
  address: undefined,
  chainId: undefined,
  status: 'reconnecting',
  isConnected: false,
  chains: []
})

// -- StoreUtil ---------------------------------------- //
export const WcStoreUtil = {
  state,

  subscribeKey<K extends StateKey>(key: K, callback: (value: WcStoreUtilState[K]) => void) {
    return subKey(state, key, callback)
  },

  subscribe(callback: (newState: WcStoreUtilState) => void) {
    return sub(state, () => callback(state))
  },

  setProvider(provider: WcStoreUtilState['provider']) {
    if (provider) {
      state.provider = ref(provider)
    }
  },

  setProviderType(providerType: WcStoreUtilState['providerType']) {
    state.providerType = providerType
  },

  setAddress(address: WcStoreUtilState['address']) {
    state.address = address
  },

  setPreferredAccountType(preferredAccountType: WcStoreUtilState['preferredAccountType']) {
    state.preferredAccountType = preferredAccountType
  },

  setChainId(chainId: WcStoreUtilState['chainId']) {
    state.chainId = chainId
  },

  setStatus(status: WcStoreUtilState['status']) {
    state.status = status
  },

  setIsConnected(isConnected: WcStoreUtilState['isConnected']) {
    state.isConnected = isConnected
  },

  setChains(chains: WcStoreUtilState['chains']) {
    state.chains = chains
  },

  setError(error: WcStoreUtilState['error']) {
    state.error = error
  },

  setCurrentChain(currentChain: WcStoreUtilState['currentChain']) {
    if (currentChain) {
      state.currentChain = currentChain
    }
  },

  setCurrentNetwork(currentNetwork: WcStoreUtilState['currentNetwork']) {
    if (currentNetwork) {
      state.currentNetwork = currentNetwork
    }
  },

  setCaipChainId(caipChainId: WcStoreUtilState['caipChainId']) {
    if (caipChainId) {
      state.caipChainId = caipChainId
    }
  },

  reset() {
    state.provider = undefined
    state.address = undefined
    state.chainId = undefined
    state.providerType = undefined
    state.status = 'disconnected'
    state.isConnected = false
    state.error = undefined
    state.currentChain = undefined
    state.currentNetwork = undefined
    state.caipChainId = undefined
    state.chains = []
    state.preferredAccountType = undefined
  }
}