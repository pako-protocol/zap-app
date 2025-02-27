import { Address, erc20Abi, parseUnits } from 'viem';

import { ROUTER_ADDRESS, WS_ADDRESS } from '../constants';
import { testPublicClient, testWalletClient } from './sonicClient';

export interface ApproveProps {
  amount: string;
  target: Address;
  spender: Address;
}
export async function approveTokens(args: ApproveProps) {
  try {
    const amountWei = parseUnits(args.amount, 18);
    const tx = await testWalletClient.writeContract({
      address: args.target, // ERC-20 token address
      abi: erc20Abi,
      functionName: 'approve',
      args: [args.spender, amountWei], // Set allowance (adjust amount)
    });

    console.log('Approval TX:', tx);
  } catch (error) {
    console.error('Approval error:', error);
    return {
      success: false,
      error: error,
    };
  }
}

export const checkAllowance = async () => {
  const vault = '0x0f5AcFC6D67410232589265a71E80661d0352848';
  const account = '0x4c9972f2AA16B643440488a788e933c139Ff0323';
  const currentAllowance = (await testPublicClient.readContract({
    abi: erc20Abi,
    address: '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38',
    functionName: 'allowance',
    args: [account, ROUTER_ADDRESS],
  })) as bigint;

  console.log('current allowance', currentAllowance);
};
