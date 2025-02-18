import { Address, encodeFunctionData, formatUnits, parseUnits } from 'viem';

import { siloAbi } from '@/abis';

//import { FunctionReturn, FunctionOptions, TransactionParams, toResult, getChainFromName } from '@heyanon/sdk';
import { BORROWABLE_WS_DEPOSIT_ADDRESS, S_BASE } from '../constants';
import { testPublicClient } from './sonicClient';

interface Props {
  chainName: string;
  account: Address;
  amount: string;
}

export async function withdrawSTS(amount: string) {
  const account = '0x2237A1E5Ed40758752a7Da5F118057af9efA0607'; //'0x4c9972f2AA16B643440488a788e933c139Ff0323';
  try {
    const amountInWei = parseUnits(amount, 18);
    if (amountInWei === BigInt(0)) {
      console.log('Amount must be greater than 0');
      return { success: false, error: 'Amount must be greater than 0' };
    }

    const maxWithdrawAmount = (await testPublicClient.readContract({
      abi: siloAbi,
      address: S_BASE,
      functionName: 'maxWithdraw',
      args: [account],
    })) as bigint;

    if (maxWithdrawAmount < amountInWei) {
      console.log(
        `Insufficient withdraw amount. Have ${formatUnits(maxWithdrawAmount, 18)}, want to withdraw ${amount}`,
        true,
      );
      return { success: false, error: 'NOT_ENOUGH_BALANCE' }; // ✅ Stop execution
    }

    console.log('max withdrw', maxWithdrawAmount);

    console.log('Preparing to withdraw stS tokens from Silo...');

    const collateralType = 1;
    console.log('Waiting for transaction confirmation...');

    const { request } = await testPublicClient.simulateContract({
      address: S_BASE,
      abi: siloAbi,
      functionName: 'withdraw',
      args: [amountInWei, account, account, collateralType],
      account: account,
    });

    console.log('The results', request);

    console.log('The results', request);
    return { success: true, message: 'Deposit successful', data: request };
  } catch (error) {
    console.log('Deposit error:', error);
    return { success: false, error: error };
  }
}
