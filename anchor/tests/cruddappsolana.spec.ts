import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Cruddappsolana} from '../target/types/cruddappsolana'

describe('cruddappsolana', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Cruddappsolana as Program<Cruddappsolana>

  const cruddappsolanaKeypair = Keypair.generate()

  it('Initialize Cruddappsolana', async () => {
    await program.methods
      .initialize()
      .accounts({
        cruddappsolana: cruddappsolanaKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([cruddappsolanaKeypair])
      .rpc()

    const currentCount = await program.account.cruddappsolana.fetch(cruddappsolanaKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Cruddappsolana', async () => {
    await program.methods.increment().accounts({ cruddappsolana: cruddappsolanaKeypair.publicKey }).rpc()

    const currentCount = await program.account.cruddappsolana.fetch(cruddappsolanaKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Cruddappsolana Again', async () => {
    await program.methods.increment().accounts({ cruddappsolana: cruddappsolanaKeypair.publicKey }).rpc()

    const currentCount = await program.account.cruddappsolana.fetch(cruddappsolanaKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Cruddappsolana', async () => {
    await program.methods.decrement().accounts({ cruddappsolana: cruddappsolanaKeypair.publicKey }).rpc()

    const currentCount = await program.account.cruddappsolana.fetch(cruddappsolanaKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set cruddappsolana value', async () => {
    await program.methods.set(42).accounts({ cruddappsolana: cruddappsolanaKeypair.publicKey }).rpc()

    const currentCount = await program.account.cruddappsolana.fetch(cruddappsolanaKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the cruddappsolana account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        cruddappsolana: cruddappsolanaKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.cruddappsolana.fetchNullable(cruddappsolanaKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
