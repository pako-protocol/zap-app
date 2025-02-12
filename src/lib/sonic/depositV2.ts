import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
  parseUnits,
} from 'viem';

import { routerAbi, stsAbi } from '@/abis';

import {
  BORROWABLE_STS_DEPOSIT_ADDRESS,
  ROUTER_ADDRESS,
  STS_ADDRESS,
} from '../constants';
import { checkToApprove } from '../utils/sonic/checkToApprove';
import { testPublicClient, testWalletClient } from './sonicClient';

//import { toResult, getChainFromName, checkToApprove } from '@heyanon/sdk';
//import { supportedChains, STS_ADDRESS, ROUTER_ADDRESS, BORROWABLE_STS_DEPOSIT_ADDRESS } from '../constants';
//import { routerAbi, stsAbi } from '../abis';
//import { testPublicClient, testWalletClient } from '../provider'; // Import your providers

interface Props {
  chainName?: string;
  account?: Address;
  amount: string;
}

export async function depositSTSV2({ amount }: Props): Promise<string> {
  if (!amount) {
    console.error('Amount is missing');
    return 'Amount is required';
  }

  if (isNaN(Number(amount))) {
    console.error('Invalid amount:', amount);
    return 'Invalid amount';
  }

  const account = '0x4c9972f2AA16B643440488a788e933c139Ff0323';
  console.log('Preparing to deposit stS tokens to Silo Finance...');

  const amountInWei = parseUnits(amount, 18);
  if (amountInWei === BigInt(0)) {
    console.error('Amount must be greater than 0');
    return 'Amount must be greater than 0';
  }

  // Fetch balance
  const stSBalance = (await testPublicClient.readContract({
    abi: stsAbi,
    address: STS_ADDRESS,
    functionName: 'balanceOf',
    args: [account],
  })) as bigint;

  if (stSBalance < amountInWei) {
    console.error(
      `Insufficient stS balance. Have ${formatUnits(stSBalance, 18)}, want to deposit ${amount}`,
    );
    return 'Insufficient stS balance';
  }

  // Approve if needed
  await checkToApprove({
    args: {
      account,
      target: STS_ADDRESS,
      spender: ROUTER_ADDRESS,
      amount: amountInWei,
    },
    provider: testPublicClient,
    transactions: [],
  });

  const collateralType = 1;
  const options = encodeAbiParameters(
    [
      { name: 'amount', type: 'uint256' },
      { name: 'ISilo.CollateralType', type: 'uint8' },
    ],
    [amountInWei, collateralType],
  );

  const depositActionType = 0;
  const tx = {
    to: ROUTER_ADDRESS,
    data: encodeFunctionData({
      abi: routerAbi,
      functionName: 'execute',
      args: [
        [
          {
            actionType: depositActionType,
            silo: BORROWABLE_STS_DEPOSIT_ADDRESS,
            asset: STS_ADDRESS,
            options: options,
          },
        ],
      ],
    }),
  };

  console.log('Sending transaction...');
  try {
    const txHash = await testWalletClient.sendTransaction({
      to: tx.to,
      data: tx.data,
      //account,
      //value: BigInt(0), // ✅ Explicitly set to zero
    });

    console.log('Transaction sent:', txHash);
    return `Successfully deposited ${amount} stS to Silo Finance. Tx Hash: ${txHash}`;
  } catch (error) {
    console.error('Transaction failed:', error);
    return `Transaction failed: ${error}`;
  }
}
