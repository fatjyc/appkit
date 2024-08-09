import * as viemChains from 'viem/chains'

if (!process.env['NEXT_PUBLIC_PROJECT_ID']) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is required')
}

function getBlockchainApiRpcUrl(chainId: number) {
  return `https://rpc.walletconnect.org/v1/?chainId=eip155:${chainId}&projectId=${process.env['NEXT_PUBLIC_PROJECT_ID']}`
}

export const mainnet = {
  id: 1,
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: getBlockchainApiRpcUrl(1),
  chain: 'evm'
}

export const arbitrum = {
  chainId: 42161,
  name: 'Arbitrum',
  currency: 'ETH',
  explorerUrl: 'https://arbiscan.io',
  rpcUrl: getBlockchainApiRpcUrl(42161),
  chain: 'evm'
}

export const avalanche = {
  chainId: 43114,
  name: 'Avalanche',
  currency: 'AVAX',
  explorerUrl: 'https://snowtrace.io',
  rpcUrl: getBlockchainApiRpcUrl(43114),
  chain: 'evm'
}

export const binanceSmartChain = {
  chainId: 56,
  name: 'Binance Smart Chain',
  currency: 'BNB',
  explorerUrl: 'https://bscscan.com',
  rpcUrl: getBlockchainApiRpcUrl(56),
  chain: 'evm'
}

export const optimism = {
  chainId: 10,
  name: 'Optimism',
  currency: 'ETH',
  explorerUrl: 'https://optimistic.etherscan.io',
  rpcUrl: getBlockchainApiRpcUrl(10),
  chain: 'evm'
}

export const polygon = {
  chainId: 137,
  name: 'Polygon',
  currency: 'MATIC',
  explorerUrl: 'https://polygonscan.com',
  rpcUrl: getBlockchainApiRpcUrl(137),
  chain: 'evm'
}

export const gnosis = {
  chainId: 100,
  name: 'Gnosis',
  currency: 'xDAI',
  explorerUrl: 'https://gnosis.blockscout.com',
  rpcUrl: getBlockchainApiRpcUrl(100),
  chain: 'evm'
}

export const zkSync = {
  chainId: 324,
  name: 'ZkSync',
  currency: 'ETH',
  explorerUrl: 'https://explorer.zksync.io',
  rpcUrl: getBlockchainApiRpcUrl(324),
  chain: 'evm'
}

export const zora = {
  chainId: 7777777,
  name: 'Zora',
  currency: 'ETH',
  explorerUrl: 'https://explorer.zora.energy',
  rpcUrl: getBlockchainApiRpcUrl(7777777),
  chain: 'evm'
}

export const celo = {
  chainId: 42220,
  name: 'Celo',
  currency: 'CELO',
  explorerUrl: 'https://explorer.celo.org/mainnet',
  rpcUrl: getBlockchainApiRpcUrl(42220),
  chain: 'evm'
}

export const base = {
  chainId: 8453,
  name: 'Base',
  currency: 'BASE',
  explorerUrl: 'https://basescan.org',
  rpcUrl: getBlockchainApiRpcUrl(8453),
  chain: 'evm'
}

export const aurora = {
  chainId: 1313161554,
  name: 'Aurora',
  currency: 'ETH',
  explorerUrl: 'https://explorer.aurora.dev',
  rpcUrl: getBlockchainApiRpcUrl(1313161554),
  chain: 'evm'
}

export const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: getBlockchainApiRpcUrl(11155111),
  chain: 'evm'
}

export const baseSepolia = {
  chainId: 84532,
  name: 'Base Sepolia',
  currency: 'BASE',
  explorerUrl: 'https://sepolia.basescan.org',
  rpcUrl: getBlockchainApiRpcUrl(84532),
  chain: 'evm'
}

export const solana = {
  chainId: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
  name: 'Solana',
  currency: 'SOL',
  explorerUrl: 'https://solscan.io',
  rpcUrl: 'https://rpc.walletconnect.org/v1',
  chain: 'solana'
}

export const solanaTestnet = {
  chainId: '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z',
  name: 'Solana Testnet',
  currency: 'SOL',
  explorerUrl: 'https://explorer.solana.com/?cluster=testnet',
  rpcUrl: 'https://rpc.walletconnect.org/v1'
}

export const solanaDevnet = {
  chainId: 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
  name: 'Solana Devnet',
  currency: 'SOL',
  explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
  rpcUrl: 'https://rpc.walletconnect.org/v1'
}

export function getChain(id: number) {
  const chains = Object.values(viemChains) as viemChains.Chain[]

  return chains.find(x => x.id === id)
}
