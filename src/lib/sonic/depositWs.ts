import { encodeAbiParameters, erc20Abi, formatUnits, parseUnits } from 'viem';

import { routerAbi } from '@/abis';
import { getViemProvider } from '@/server/actions/ai';

import {
  ETH_ADDRESS,
  ETH_SILO,
  ROUTER_ADDRESS,
  S_BASE,
  WS_ADDRESS,
} from '../constants';
import { ApproveProps, approveTokens } from './approveAllowance';
import { testPublicClient } from './sonicClient';

export async function depositWts(amount: string) {
  const account2 = '0x0A408a7F76F206C7898227CDaC871f0E4D3e46eE'; //'0x4c9972f2AA16B643440488a788e933c139Ff0323';0x0A408a7F76F206C7898227CDaC871f0E4D3e46eE

  console.log('Preparing to deposit stS tokens to Silo Finance...');

  try {
    const { walletClient } = await getViemProvider();
    const amountInWei = parseUnits(amount, 18);
    if (amountInWei === BigInt(0)) {
      console.log('Amount must be greater than 0');
      return { success: false, error: 'Amount must be greater than 0' }; // ✅ Stop execution
    }

    const userBalance = (await testPublicClient.readContract({
      abi: erc20Abi,
      address: WS_ADDRESS,
      functionName: 'balanceOf',
      args: [account2],
    })) as bigint;

    if (userBalance < amountInWei) {
      console.log(
        `Insufficient wS balance. Have ${formatUnits(userBalance, 18)}, want to deposit ${amount}`,
      );
      return { success: false, error: 'NOT_ENOUGH_BALANCE' }; // ✅ Stop execution
    }
    console.log('User balance is', userBalance); // ✅ Check allowance before approving
    const currentAllowance = (await testPublicClient.readContract({
      abi: erc20Abi,
      address: WS_ADDRESS,
      functionName: 'allowance',
      args: [account2, ROUTER_ADDRESS],
    })) as bigint;

    if (currentAllowance < amountInWei) {
      console.log(
        `Current allowance: ${formatUnits(currentAllowance, 18)}. Approving more...`,
      );
      const props: ApproveProps = {
        amount: amount,
        target: WS_ADDRESS,
        spender: ROUTER_ADDRESS,
      };
      const approval = await approveTokens(props);
      if (approval?.success === false) {
        console.log('Token approval failed:', approval.error);
        return { success: false, error: 'Token approval failed' };
      }
    } else {
      console.log(
        `Allowance is sufficient: ${formatUnits(currentAllowance, 18)}`,
      );
    }

    const collateralType = 1;
    const options = encodeAbiParameters(
      [
        { name: 'amount', type: 'uint256' },
        { name: 'ISilo.CollateralType', type: 'uint8' },
      ],
      [amountInWei, collateralType],
    );

    const depositActionType = 0;

    console.log('Waiting for transaction confirmation...');

    const { request } = await testPublicClient.simulateContract({
      address: ROUTER_ADDRESS,
      abi: routerAbi,
      functionName: 'execute',
      args: [
        [
          {
            actionType: depositActionType,
            silo: S_BASE,
            asset: WS_ADDRESS,
            options: options,
          },
        ],
      ],
      account: account2,
    });

    console.log('The results', request);
    const hash = await walletClient!.writeContract(request);
    console.log('the tx hash', hash);
    return { success: true, message: 'Deposit successful', data: request };
  } catch (error) {
    console.log('Deposit error:', error);
    return { success: false, error: error };
  }
}
