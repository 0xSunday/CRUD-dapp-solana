'use client'

import { getCruddappsolanaProgram, getCruddappsolanaProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useCruddappsolanaProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCruddappsolanaProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getCruddappsolanaProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['cruddappsolana', 'all', { cluster }],
    queryFn: () => program.account.cruddappsolana.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['cruddappsolana', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ cruddappsolana: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useCruddappsolanaProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCruddappsolanaProgram()

  const accountQuery = useQuery({
    queryKey: ['cruddappsolana', 'fetch', { cluster, account }],
    queryFn: () => program.account.cruddappsolana.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['cruddappsolana', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ cruddappsolana: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['cruddappsolana', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ cruddappsolana: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['cruddappsolana', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ cruddappsolana: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['cruddappsolana', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ cruddappsolana: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
