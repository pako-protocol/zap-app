// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
//import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import axios from 'axios';
import { Address, erc20Abi, formatUnits, parseUnits } from 'viem';

import {
  Token,
  getHyperSonicTokens,
} from '@/server/actions/getHypersonicTokens';

import { HYPERSONIC_ROUTER_ADDRESS, WITHELISTED_TOKENS } from '../constants';
import { ApproveProps, approveTokens } from './approveAllowance';
import { testPublicClient } from './sonicClient';

//import { MIN_ERC20_ABI } from '../abis/erc20Abi';
//import { HYPERSONIC_ROUTER } from '../constants';
//import { validateAndGetTokenDetails, validateWallet } from '../utils';

interface Props {
  chainName: string;
  account: Address;
  inToken: string;
  outToken: string;
  inAmount: string;
}

//const { checkToApprove } = EVM.utils;

/**
 * Execute a token swap on Hypersonic DEX aggregator.
 *
 * @param props - Swap parameters including tokens, amount and account
 * @param options - System tools for blockchain interactions
 * @returns Swap result containing the transaction hash
 */
export async function swap({ inToken, outToken, inAmount }: Props) {
  const account2 = '0x0A408a7F76F206C7898227CDaC871f0E4D3e46eE';
  // Validate wallet

  const allTokens: Token[] = await getHyperSonicTokens();
  // Validate input token
  const tokenFoundA = allTokens.find((i) => i.token.symbol === inToken);
  if (!tokenFoundA) {
    console.log('Token from not found', true);
    return { success: false, error: 'IN TOKEN NOT FOUND' };
  }

  // Validate output token

  const tokenFoundB = allTokens.find((i) => i.token.symbol === outToken);
  if (!tokenFoundB) {
    console.log('Token to not found', true);
    return { success: false, error: 'OUTPUT TOKEN NOT FOUND' };
  }

  const chainId = '146';
  const amountInWei = parseUnits(inAmount, 18);
  const amountInWeiStr = parseUnits(inAmount, 18).toString();
  try {
    console.log('Getting best swap route...');

    // Get quote from Hypersonic API
    const quoteResponse = await axios.post(
      'https://api.hypersonic.exchange/v1/quote',
      {
        chainId: chainId, //inTokenDetails.data.chainId,
        inToken: tokenFoundA?.address, //inTokenDetails.data.tokenAddress,
        outToken: tokenFoundB?.address, //outTokenDetails.data.tokenAddress,
        inAmount: amountInWeiStr,
        slippage: 2.5, // Using 2.5% slippage - recommended for good surfing Sonic speed 💥
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (!quoteResponse.data.success) {
      console.log(
        `Failed to get quote: ${quoteResponse.data.error || 'Unknown error'}`,
        true,
      );
      return;
    }

    console.log('Building swap transaction...');

    // Build transaction from quote
    const buildResponse = await axios.post(
      'https://api.hypersonic.exchange/v1/build',
      quoteResponse.data.data,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (!buildResponse.data.success) {
      console.log(
        `Failed to build transaction: ${buildResponse.data.error || 'Unknown error'}`,
        true,
      );
      return;
    }

    // Check and prepare approve transaction if needed
    const userBalance = (await testPublicClient.readContract({
      abi: erc20Abi,
      address: tokenFoundA.address as Address,
      functionName: 'balanceOf',
      args: [account2],
    })) as bigint;

    if (userBalance < amountInWei) {
      console.log(
        `Insufficient wS balance. Have ${formatUnits(userBalance, 18)}, want to deposit ${inAmount}`,
      );
      return { success: false, error: 'NOT_ENOUGH_BALANCE' }; // ✅ Stop execution
    }
    console.log('User balance is', userBalance); // ✅ Check allowance before approving
    const currentAllowance = (await testPublicClient.readContract({
      abi: erc20Abi,
      address: tokenFoundA.address as Address,
      functionName: 'allowance',
      args: [account2, HYPERSONIC_ROUTER_ADDRESS],
    })) as bigint;

    if (currentAllowance < amountInWei) {
      console.log(
        `Current allowance: ${formatUnits(currentAllowance, 18)}. Approving more...`,
      );
      const props: ApproveProps = {
        amount: inAmount,
        target: tokenFoundA.address as Address,
        spender: HYPERSONIC_ROUTER_ADDRESS,
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

    // Add swap transaction
    const swapTx = buildResponse.data.data.transaction;

    console.log('SwapTx transaction object data', swapTx);

    // Send transactions

    console.log(`Successfully swapped ${inToken} for ${outToken}`);
  } catch (error) {
    console.log(
      `Failed to execute swap: ${error instanceof Error ? error.message : 'Unknown error'}`,
      true,
    );
  }
}
