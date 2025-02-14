import { erc20Abi, parseUnits } from 'viem';

import { ROUTER_ADDRESS, WS_ADDRESS } from '../constants';
import { testWalletClient } from './sonicClient';

export async function approveTokens(amount: string) {
  try {
    const amountWei = parseUnits(amount, 18);
    const tx = await testWalletClient.writeContract({
      address: WS_ADDRESS, // ERC-20 token address
      abi: erc20Abi,
      functionName: 'approve',
      args: [ROUTER_ADDRESS, amountWei], // Set allowance (adjust amount)
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
