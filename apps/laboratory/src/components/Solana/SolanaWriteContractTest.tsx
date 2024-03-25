import React from 'react'
import { Button, useToast } from '@chakra-ui/react'
import {
  Connection,
  SystemProgram,
  PublicKey,
  Keypair,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js'
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'

import type { Connection, Signer } from '@solana/web3.js'

/*
 * Hypothetical Program ID for the counter program; replace with your actual program ID
 * export const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS')
 * export const PROGRAM_ID = new PublicKey('p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98')
 */
/*
 * Export const PROGRAM_ID = new PublicKey('GobzzzFQsFAHPvmwT42rLockfUCeV3iutEkK218BxT8K')
 * Export const PROGRAM_ID = new PublicKey('11111111111111111111111111111111')
 */
export const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS')
export const COUNTER_ACCOUNT_SIZE = 8

const PHANTOM_DEVNET_ADDRESS = '7qPFiUY5wEUceShpXSSYcMzUWHpjqXwFJ3GBdCP4eWQE'
const recipientAddress = new PublicKey(PHANTOM_DEVNET_ADDRESS)
const amountInLamports = 100000000

export function SolanaWriteContractTest() {
  /*
   * Const connection = new Connection(
   *   'https://rpc.walletconnect.com/v1?chainId=solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp&projectId=c6f78092df3710d5a3008ed92eb8b170'
   * )
   */

  const toast = useToast()
  const { address } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()

  const connection = new Connection('http://localhost:8899')

  const counterKeypair = Keypair.generate()
  const counter = counterKeypair.publicKey

  // Randomly generate our wallet
  const payerKeypair = Keypair.fromSecretKey(
    Uint8Array.from([
      96, 253, 34, 232, 54, 114, 153, 128, 49, 238, 144, 203, 183, 83, 244, 198, 102, 80, 119, 196,
      233, 68, 20, 128, 197, 10, 158, 222, 94, 230, 117, 225, 178, 24, 103, 254, 242, 147, 28, 48,
      17, 55, 166, 55, 31, 235, 231, 205, 44, 154, 60, 111, 47, 33, 131, 26, 171, 214, 45, 217, 66,
      41, 187, 37
    ])
  )
  const payer = payerKeypair.publicKey

  console.log(payer)

  //

  async function onIncrementCounter() {
    try {
      if (!walletProvider || !address) {
        throw new Error('User is disconnected')
      }

      if (!connection) {
        throw new Error('No connection set')
      }

      /*
       * Randomly generate the account key
       * to sign for setting up the Counter state
       */

      console.log('onIncrementCounter')
      /*
       * Airdrop our wallet 1 Sol
       * await connection.requestAirdrop(payer, LAMPORTS_PER_SOL)
       */
      // await connection.requestAirdrop(payer, LAMPORTS_PER_SOL)
      // Create a TransactionInstruction to interact with our counter program
      const allocIx: TransactionInstruction = SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: counter,
        lamports: await connection.getMinimumBalanceForRentExemption(COUNTER_ACCOUNT_SIZE),
        space: COUNTER_ACCOUNT_SIZE,
        programId: PROGRAM_ID
      })
      console.log('TX allocIx')
      const incrementIx: TransactionInstruction = new TransactionInstruction({
        programId: PROGRAM_ID,
        keys: [
          {
            pubkey: counter,
            isSigner: false,
            isWritable: true
          }
        ],
        data: Buffer.from([0x0])
      })
      console.log('TX incrementIx')

      const tx = new Transaction().add(allocIx).add(incrementIx)
      console.log('TX transaction')

      // Explicitly set the feePayer to be our wallet (this is set to first signer by default)
      tx.feePayer = payer

      /*
       * Fetch a "timestamp" so validators know this is a recent transaction
       * tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash
       */
      console.log('TX recentBlockhash')
      // Send transaction to network (local network)
      await sendAndConfirmTransaction(connection, tx, [payerKeypair, counterKeypair])
      console.log('TX sendAndConfirmTransaction')

      // Get the counter account info from network
      const counterAccountInfo = await connection.getAccountInfo(counter, {
        commitment: 'confirmed'
      })
      assert(counterAccountInfo, 'Expected counter account to have been created')

      // Deserialize the counter & check count has been incremented
      const counterAccount = deserializeCounterAccount(counterAccountInfo.data)
      assert(counterAccount.count.toNumber() === 1, 'Expected count to have been 1')
      console.log(`[alloc+increment] count is: ${counterAccount.count.toNumber()}`)

      toast({ title: 'Succcess', description: tx.signature, status: 'success', isClosable: true })
    } catch (err) {
      console.error(err)
      toast({
        title: 'Transaction failed',
        description: 'Failed to increment counter',
        status: 'error',
        isClosable: true
      })
    }
  }

  return (
    <Button data-testid="sign-message-button" onClick={onIncrementCounter}>
      Increment Counter
    </Button>
  )
}
