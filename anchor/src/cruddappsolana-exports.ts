// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import CruddappsolanaIDL from '../target/idl/cruddappsolana.json'
import type { Cruddappsolana } from '../target/types/cruddappsolana'

// Re-export the generated IDL and type
export { Cruddappsolana, CruddappsolanaIDL }

// The programId is imported from the program IDL.
export const CRUDDAPPSOLANA_PROGRAM_ID = new PublicKey(CruddappsolanaIDL.address)

// This is a helper function to get the Cruddappsolana Anchor program.
export function getCruddappsolanaProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...CruddappsolanaIDL, address: address ? address.toBase58() : CruddappsolanaIDL.address } as Cruddappsolana, provider)
}

// This is a helper function to get the program ID for the Cruddappsolana program depending on the cluster.
export function getCruddappsolanaProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Cruddappsolana program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return CRUDDAPPSOLANA_PROGRAM_ID
  }
}
