// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  parseUnits,
} from 'viem';

import { routerAbi } from '@/abis';

//import { FunctionReturn, FunctionOptions, TransactionParams, toResult, getChainFromName, checkToApprove } from '@heyanon/sdk';
import {
  BORROWABLE_WS_DEPOSIT_ADDRESS,
  ROUTER_ADDRESS,
  WS_ADDRESS,
} from '../constants';
import { approveTokens } from './approveAllowance';
import { testPublicClient } from './sonicClient';

interface Props {
  chainName: string;
  account: Address;
  amount: string;
}

export async function repayWS(amount: string) {
  const account = '0x4c9972f2AA16B643440488a788e933c139Ff0323';

  console.log('Preparing to repay wS tokens to Silo...');

  try {
    const amountInWei = parseUnits(amount, 18);
    if (amountInWei === BigInt(0)) {
      console.log('Amount must be greater than 0');
      return { success: false, error: 'Amount must be greater than 0' };
    }

    const wSBalance = (await testPublicClient.readContract({
      abi: erc20Abi,
      address: WS_ADDRESS,
      functionName: 'balanceOf',
      args: [account],
    })) as bigint;

    if (wSBalance < amountInWei) {
      console.log(
        `Insufficient wS balance. Have ${formatUnits(wSBalance, 18)}, want to repay ${amount}`,
        true,
      );
      return { success: false, error: 'NOT_ENOUGH_BALANCE' };
    }
    // ✅ Check allowance before approving
    const currentAllowance = (await testPublicClient.readContract({
      abi: erc20Abi,
      address: WS_ADDRESS,
      functionName: 'allowance',
      args: [account, ROUTER_ADDRESS],
    })) as bigint;

    if (currentAllowance < amountInWei) {
      console.log(
        `Current allowance: ${formatUnits(currentAllowance, 18)}. Approving more...`,
      );
      const approval = await approveTokens(amount);
      if (approval?.success === false) {
        console.log('Token approval failed:', approval.error);
        return { success: false, error: 'Token approval failed' };
      }
    } else {
      console.log(
        `Allowance is sufficient: ${formatUnits(currentAllowance, 18)}`,
      );
    }

    const collateralType = 1; // means Silo can use the stS as collateral
    const options = encodeAbiParameters(
      [
        { name: 'amount', type: 'uint256' },
        { name: 'ISilo.CollateralType', type: 'uint8' },
      ],
      [amountInWei, collateralType],
    );

    const repayActionType = 2;
    // Prepare deposit transaction
    const { request } = await testPublicClient.simulateContract({
      address: ROUTER_ADDRESS,
      abi: routerAbi,
      functionName: 'execute',
      args: [
        [
          {
            actionType: repayActionType,
            silo: BORROWABLE_WS_DEPOSIT_ADDRESS,
            asset: WS_ADDRESS,
            options: options,
          },
        ],
      ],
      account: account,
    });

    console.log('The results', request);
    return { success: true, message: 'Deposit successful', data: request };
  } catch (error) {
    console.log('Deposit error:', error);
    return { success: false, error: error };
  }
}
