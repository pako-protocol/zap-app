import { Address, encodeFunctionData, erc20Abi, parseUnits } from 'viem';

import { siloAbi } from '@/abis';
import { TransactionParams } from '@/types/TxTypes';

import { BORROWABLE_WS_DEPOSIT_ADDRESS, WS_ADDRESS } from '../constants';
import { testPublicClient, testWalletClient } from './sonicClient';

export async function borrowWS(amount: string) {
  const account = '0x4c9972f2AA16B643440488a788e933c139Ff0323';
  const chainId = testPublicClient.getChainId();
  if (!chainId) console.log(`Unsupported chain name`, true);
  if (typeof amount !== 'string') {
    console.error('Amount must be a string');
    return 'Invalid amount type';
  }

  const amountInWei = parseUnits(amount, 18);
  console.log('wei amount', amountInWei);

  if (amountInWei === BigInt(0)) {
    console.log('Amount must be greater than 0', true);
    return 'Invalid amount';
  }

  // ✅ Check max borrow
  const maxBorrow = (await testPublicClient.readContract({
    address: BORROWABLE_WS_DEPOSIT_ADDRESS,
    abi: siloAbi,
    functionName: 'maxBorrow',
    args: [account],
  })) as bigint;

  if (maxBorrow < amountInWei) {
    console.log(
      `Insufficient borrow amount. Have ${maxBorrow}, want to borrow: ${amountInWei}`,
      true,
    );
    return 'Insufficient balance';
  }

  console.log('Preparing to borrow wS token from Silo Finance...');

  // ✅ Check Allowance
  let allowance = (await testPublicClient.readContract({
    address: WS_ADDRESS, // ERC20 token address
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account, BORROWABLE_WS_DEPOSIT_ADDRESS],
  })) as bigint;

  console.log(`Current Allowance: ${allowance}, Required: ${amountInWei}`);

  if (allowance < amountInWei) {
    console.log('Insufficient allowance. Approving...');

    // ✅ Send Approval Transaction
    const approveTxHash = await testWalletClient.sendTransaction({
      to: WS_ADDRESS,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [BORROWABLE_WS_DEPOSIT_ADDRESS, amountInWei],
      }),
    });

    console.log(`Approval transaction sent: ${approveTxHash}`);

    // ✅ Wait for confirmation
    await testPublicClient.waitForTransactionReceipt({ hash: approveTxHash });

    console.log('Approval confirmed.');

    // ✅ Re-check Allowance
    allowance = (await testPublicClient.readContract({
      address: WS_ADDRESS,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [account, BORROWABLE_WS_DEPOSIT_ADDRESS],
    })) as bigint;

    console.log(`Updated Allowance: ${allowance}`);

    if (allowance < amountInWei) {
      console.log('Approval failed or not updated.');
      return 'Approval transaction did not update the allowance';
    }
  }

  console.log('Sending borrow transaction...');

  try {
    const { result } = await testPublicClient.simulateContract({
      address: BORROWABLE_WS_DEPOSIT_ADDRESS,
      abi: siloAbi,
      functionName: 'borrow',
      args: [amountInWei, account, account],
      account: account,
    });

    console.log('Transaction sent:', result);
    return `Successfully borrowed ${amount} wS from Silo Finance. Tx Hash: ${result}`;
  } catch (error) {
    console.error('Transaction failed:', error);
    return `Transaction failed: ${error}`;
  }
}
