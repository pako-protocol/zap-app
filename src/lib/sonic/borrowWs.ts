import { Address, encodeFunctionData, parseEther, parseUnits } from 'viem';

import { siloAbi } from '@/abis';

//import { FunctionReturn, FunctionOptions, TransactionParams, toResult, getChainFromName } from '@heyanon/sdk';
import { BORROWABLE_WS_DEPOSIT_ADDRESS, S_BASE } from '../constants';
import { testPublicClient } from './sonicClient';

interface Props {
  chainName: string;
  account: Address;
  amount: string;
}

/**
 * Borrow wS token from Silo Finance
 * @param {Props} { chainName, account, amount }
 * @param {FunctionOptions} { sendTransactions, getProvider, notify }
 * @returns Transaction result
 */
export async function borrowWS(amount: string) {
  const account = '0x4c9972f2AA16B643440488a788e933c139Ff0323';

  try {
    const amountInWei = parseUnits(amount, 18);
    if (amount < '50') {
      console.log('Amount must be greater than 49', true);
      return { success: false, error: 'Amount must be greater than 0' };
    }

    const maxBorrow = (await testPublicClient.readContract({
      address: BORROWABLE_WS_DEPOSIT_ADDRESS,
      abi: siloAbi,
      functionName: 'maxBorrow',
      args: [account],
    })) as bigint;
    if (maxBorrow < amountInWei) {
      console.log(
        `Insufficient borrow amount. Have ${maxBorrow}, want to borrow: ${amount}`,
      );
      return { success: false, error: 'NOT_ENOUGH_BALANCE' };
    }

    console.log('Preparing to borrow wS token from Silo Finance...');

    console.log('Waiting for transaction confirmation...');

    const { request } = await testPublicClient.simulateContract({
      address: BORROWABLE_WS_DEPOSIT_ADDRESS,
      abi: siloAbi,
      functionName: 'borrow',
      args: [amountInWei, account, account],
      account: account,
    });

    console.log('The results', request);
    return { success: true, message: 'Deposit successful', data: request };
  } catch (error) {
    console.log('Borrow error:', error);
    return { success: false, error: error };
  }
}
