import {
  Address,
  PublicClient,
  encodeFunctionData,
  erc20Abi,
  getAddress,
  parseUnits,
} from 'viem';

import { TransactionParams } from '@/types/TxTypes';

const ZERO_ALLOWANCE: Record<number, Address[]> = {
  1: ['0xdAC17F958D2ee523a2206206994597C13D831ec7'],
};

interface Props {
  readonly args: {
    readonly account: Address;
    readonly target: Address;
    readonly spender: Address;
    readonly amount: bigint;
  };
  readonly provider: PublicClient;
  readonly transactions: TransactionParams[];
}

export async function checkToApprove({
  args,
  transactions,
  provider,
}: Props): Promise<void> {
  const { account, target, spender, amount } = args;

  const allowance = await provider.readContract({
    address: target,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account, spender],
  });

  console.log('allowance', allowance);
  let chainId = provider.chain?.id;
  if (!chainId) {
    chainId = await provider.getChainId();
  }

  if (ZERO_ALLOWANCE[chainId]?.includes(getAddress(target))) {
    if (allowance < amount && allowance > BigInt(0)) {
      transactions.push({
        target,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: 'approve',
          args: [spender, BigInt(0)],
        }),
      });
    }
  }

  if (allowance < amount) {
    transactions.push({
      target,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [spender, amount],
      }),
    });
  }
}
