//
//import { FunctionReturn, toResult } from '@heyanon/sdk';
import axios from 'axios';
import { formatUnits, parseEther, parseUnits } from 'viem';

import {
  Token,
  getHyperSonicTokens,
} from '@/server/actions/getHypersonicTokens';

//import { validateAndGetTokenDetails } from '../utils';

interface Props {
  chainName: string;
  inToken: string;
  outToken: string;
  inAmount: string;
}

/**
 * Get quote for swapping tokens on Hypersonic DEX aggregator.
 *
 * @param props - Quote parameters including tokens and amount
 * @param options - System tools for blockchain interactions
 * @returns Quote result with expected output amount and route
 */
export async function quote({ inToken, outToken, inAmount }: Props) {
  // Get whitelisted tokens
  const allTokens: Token[] = await getHyperSonicTokens();
  // Validate input token
  const tokenFoundA = allTokens.find((i) => i.symbol === inToken);
  if (!tokenFoundA) {
    console.log('Token from not found', true);
    return;
  }

  // Validate output token

  const tokenFoundB = allTokens.find((i) => i.symbol === outToken);
  if (!tokenFoundB) {
    console.log('Token to not found', true);
    return;
  }

  const chainId = '146';
  const amountInWei = parseUnits(inAmount, 18);
  const formatted = formatUnits(amountInWei, 18);
  console.log('formatted amount', formatted);
  console.log('amount wei', amountInWei);
  const typedAmount = '1000000000000000000';
  try {
    // Get quote from Hypersonic API
    const response = await axios.post(
      'https://api.hypersonic.exchange/v1/quote',
      {
        chainId: chainId, //inTokenDetails.data.chainId,
        inToken: tokenFoundA?.address, //inTokenDetails.data.tokenAddress,
        outToken: tokenFoundB?.address,
        inAmount: typedAmount,
        slippage: 2.5, // Using 2.5% slippage - recommended for good surfing Sonic speed 💥
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (!response.data.success) {
      console.log(
        `Failed to get quote: ${response.data.error || 'Unknown error'}`,
        true,
      );
      return;
    }

    const quoteData = response.data.data;

    console.log(
      `Quote for ${formatUnits(BigInt(inAmount), quoteData.inDecimals)} ${inToken} to ${outToken}:\n` +
        `Expected output: ${formatUnits(quoteData.outAmount, quoteData.outDecimals)} ${outToken}\n` +
        `Minimum received: ${formatUnits(quoteData.minReceived, quoteData.outDecimals)} ${outToken}\n`,
    );

    return 'Success';
  } catch (e) {
    console.log(
      `Failed to fetch quote: ${e instanceof Error ? e.message : 'Unknown error'}`,
      true,
    );
  }
}
