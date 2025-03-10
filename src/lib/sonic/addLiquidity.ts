// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import BigNumber from 'bignumber.js';
import {
  Address,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  parseUnits,
} from 'viem';

import { ichiVaultAbi } from '@/abis';

import { IchiVault, ichiVaults } from '../swapxutils';
import { approveTokens } from './approveAllowance';
import { testPublicClient } from './sonicClient';

interface Props {
  account?: Address;
  vault?: Address;
  amount0: string;
  amount1: string;
}

export async function addLiquidity({ amount0, amount1 }: Props) {
  const vault = '0x0f5AcFC6D67410232589265a71E80661d0352848';
  const account = '0x4c9972f2AA16B643440488a788e933c139Ff0323';
  console.log('Wallet not connected', true);

  console.log('Preparing to add liquidity to SwapX...');

  const vaultFound: IchiVault = ichiVaults.find((i) => i.vault === vault);
  if (!vaultFound) console.log('Vault not found', true);

  const amount0InWei = parseUnits(amount0, vaultFound.token0.decimals);
  const amount1InWei = parseUnits(amount1, vaultFound.token1.decimals);

  if (amount0InWei === BigInt(0) && amount1InWei === BigInt(0))
    console.log('At least one of the amount must be greater than 0', true);

  const token0Allowed = vaultFound.isToken0Allowed || amount0InWei == BigInt(0);
  const token1Allowed = vaultFound.isToken1Allowed || amount1InWei == BigInt(0);
  if (!token0Allowed || !token1Allowed) {
    let message = '';
    if (!token0Allowed) message += `(${vaultFound.token0.symbol}) `;
    if (!token1Allowed) message += `(${vaultFound.token1.symbol})`;
    message = `Vault token ${message} not allowed`;
    console.log(message);
  }

  console.log('fOUND VAULT IS ', vaultFound);
  console.log('validating deposit allowance token 0');
  // Validate max deposit
  try {
    const token0MaxDeposit = (await testPublicClient.readContract({
      address: vaultFound.vault,
      abi: ichiVaultAbi,
      functionName: 'deposit0Max',
      //args: [account],
    })) as bigint;
    console.log('max deposit token0 ', token0MaxDeposit);

    console.log('validating deposit allowance token 1');

    const token1MaxDeposit = (await testPublicClient.readContract({
      address: vaultFound.vault,
      abi: ichiVaultAbi,
      functionName: 'deposit1Max',
    })) as bigint;

    console.log('max deposit token0 ', token1MaxDeposit);

    console.log('max deposit comparison');

    if (amount0InWei > token0MaxDeposit || amount1InWei > token1MaxDeposit) {
      let message = 'Max deposit exceeded with ';
      if (amount0InWei > token0MaxDeposit) {
        const exceeded = BigInt(
          new BigNumber(amount0InWei.toString())
            .minus(token0MaxDeposit.toString())
            .toString(),
        );
        message += `(${formatUnits(exceeded, vaultFound.token0.decimals)} ${vaultFound.token0.symbol}) `;
      }
      if (amount1InWei > token1MaxDeposit) {
        const exceeded = BigInt(
          new BigNumber(amount1InWei.toString())
            .minus(token1MaxDeposit.toString())
            .toString(),
        );
        message += `(${formatUnits(exceeded, vaultFound.token1.decimals)} ${vaultFound.token1.symbol}) `;
      }
      console.log(message);
      return;
    }
    console.log('validating token 0 balance');

    // Validate token balance
    const token0Balance = await testPublicClient.readContract({
      address: vaultFound.token0.address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account],
    });
    console.log('Token 0 balance');
    const token1Balance = await testPublicClient.readContract({
      address: vaultFound.token1.address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account],
    });

    console.log(
      `token 0 balance ${token0Balance}  and token 1 balance ${token1Balance}`,
    );

    if (token0Balance < amount0InWei || token1Balance < amount1InWei) {
      let message = 'Insufficient token balance ';
      const symbol0 = vaultFound.token0.symbol;
      const symbol1 = vaultFound.token1.symbol;
      if (token0Balance < amount0InWei)
        message += `(Has ${formatUnits(token0Balance, vaultFound.token0.decimals)} ${symbol0} Needs ${amount0} ${symbol0}) `;
      if (token1Balance < amount1InWei)
        message += `(Has ${formatUnits(token1Balance, vaultFound.token1.decimals)} ${symbol1} Needs ${amount1} ${symbol1})`;
      console.log(message, true);
    }

    // ✅ Check allowance before approving
    if (token0Allowed) {
      const currentAllowance = (await testPublicClient.readContract({
        abi: erc20Abi,
        address: vaultFound.token0.address,
        functionName: 'allowance',
        args: [account, vault],
      })) as bigint;

      if (currentAllowance < amount0InWei) {
        console.log(
          `Current allowance: ${formatUnits(currentAllowance, 18)}. Approving more...`,
        );

        const args = {
          amount: amount0,
          target: vaultFound.token0.address,
          spender: vault as Address,
        };
        const approval = await approveTokens(args);
        if (approval?.success === false) {
          console.log('Token approval failed:', approval.error);
          return { success: false, error: 'Token approval failed' };
        }
      } else {
        console.log(
          `Allowance is sufficient: ${formatUnits(currentAllowance, 18)}`,
        );
      }
    }

    // ✅ Check allowance before approving
    if (token1Allowed) {
      const currentAllowance = (await testPublicClient.readContract({
        abi: erc20Abi,
        address: vaultFound.token1.address,
        functionName: 'allowance',
        args: [account, vault],
      })) as bigint;

      if (currentAllowance < amount1InWei) {
        console.log(
          `Current allowance: ${formatUnits(currentAllowance, 18)}. Approving more...`,
        );
        const args = {
          amount: amount0,
          target: vaultFound.token0.address,
          spender: vault as Address,
        };
        const approval = await approveTokens(args);
        if (approval?.success === false) {
          console.log('Token approval failed:', approval.error);
          return { success: false, error: 'Token approval failed' };
        }
      } else {
        console.log(
          `Allowance is sufficient: ${formatUnits(currentAllowance, 18)}`,
        );
      }
    }

    // Deposit token

    const { request } = await testPublicClient.simulateContract({
      address: vault,
      abi: ichiVaultAbi,
      functionName: 'deposit',
      args: [amount0InWei, amount1InWei, account],
      account: account,
    });

    console.log('The results', request);
    return { success: true, message: 'Deposit successful', data: request };
  } catch (error) {
    console.log(error);
  }
}
