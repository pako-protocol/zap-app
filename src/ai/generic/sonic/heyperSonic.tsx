import axios from 'axios';
import { Address, erc20Abi, formatUnits, parseUnits } from 'viem';
import { sonic } from 'viem/chains';
import { z } from 'zod';

import TokenCard from '@/components/sonic/token-card';
import { HYPERSONIC_ROUTER_ADDRESS } from '@/lib/constants';
import { ApproveProps, approveTokens } from '@/lib/sonic/approveAllowance';
import { testPublicClient } from '@/lib/sonic/sonicClient';
import { getViemProvider } from '@/server/actions/ai';
import {
  Token,
  getHyperSonicTokens,
} from '@/server/actions/getHypersonicTokens';

const tokens = {
  getHyperSonicWhitelistedTokens: {
    displayName: '🔍 Whitelisted tokens',
    description:
      'Retrieve a list of all tokens approved/ supported for swaps and on hyperSonic',
    parameters: z.object({
      query: z.string().describe('Token name or symbol to search for'),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const tokensData = await getHyperSonicTokens();
        return {
          success: true,
          data: tokensData,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to search tokens',
        };
      }
    },
    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: Token[];
        error?: string;
      };
      if (!typedResult.success) {
        return (
          <div className="relative overflow-hidden rounded-2xl bg-destructive/5 p-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-destructive">
                Error: {typedResult.error}
              </p>
            </div>
          </div>
        );
      }
      if (!typedResult.data?.length) {
        return (
          <div className="relative overflow-hidden rounded-2xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">No tokens found</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {typedResult.data.map((token, index) => (
            <div key={index}>
              <h2>{token.token.symbol}</h2>
            </div>
          ))}
        </div>
      );
    },
  },
};

const quote = {
  getQuote: {
    displayName: 'Quote',
    description: 'Get the estimated output amount for a token swap.',
    parameters: z.object({
      inToken: z
        .string()
        .describe('The symbol of the token being swapped (input token).'),
      outToken: z
        .string()
        .describe('The token symbol to receive after the swap (output Token)'),
      inAmount: z.string().describe('The amount of inToken to swap'),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        // GET HYPER SONIC WHITELISTED TOKENS
        // Get whitelisted tokens
        const allTokens: Token[] = await getHyperSonicTokens();
        // Validate input token
        const tokenFoundA = allTokens.find(
          (i) => i.token.symbol === params.inToken,
        );
        if (!tokenFoundA) {
          console.log('Token from not found', true);
        }

        // Validate output token

        const tokenFoundB = allTokens.find(
          (i) => i.token.symbol === params.outToken,
        );
        if (!tokenFoundB) {
          console.log('Token to not found', true);
        }

        const chainId = '146';
        const amountInWei = parseUnits(params.inAmount, 18);

        // Get quote from Hypersonic API
        const response = await axios.post(
          'https://api.hypersonic.exchange/v1/quote',
          {
            chainId: chainId, //inTokenDetails.data.chainId,
            inToken: tokenFoundA?.token.tokenAddress, //inTokenDetails.data.tokenAddress,
            outToken: tokenFoundB?.token.tokenAddress,
            inAmount: amountInWei.toString(),
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
          return {
            success: false,
            error: response.data.error || 'Unknown error',
          };
        }

        const quoteData = response.data.data;
        const message =
          `Quote for ${formatUnits(BigInt(params.inAmount), quoteData.inDecimals)} ${params.inToken} to ${params.outToken}:\n` +
          `Expected output: ${formatUnits(quoteData.outAmount, quoteData.outDecimals)} ${params.outToken}\n` +
          `Minimum received: ${formatUnits(quoteData.minReceived, quoteData.outDecimals)} ${params.outToken}\n`;

        console.log(message);

        return { success: true, data: message };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Uknown error',
        };
      }
    },

    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: Token[];
        error?: string;
      };

      if (!typedResult.success) {
        return (
          <div className="relative overflow-hidden rounded-2xl bg-destructive/5 p-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-destructive">
                Error: {typedResult.error}
              </p>
            </div>
          </div>
        );
      }
      if (!typedResult.data?.length) {
        return (
          <div className="relative overflow-hidden rounded-2xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">No tokens found</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          <h1>Token swap results card will be here</h1>
        </div>
      );
    },
  },
};

const swap = {
  swapTokens: {
    displayName: 'Token Swap',
    description:
      'Swap one token for another by specifying the input token, output token, and amount',
    parameters: z.object({
      inToken: z
        .string()
        .describe('The symbol of the token being swapped (input token).'),
      outToken: z
        .string()
        .describe('The token symbol to receive after the swap (output Token)'),
      inAmount: z.string().describe('The amount of inToken to swap'),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const { account, walletClient } = await getViemProvider();
        // GET HYPER SONIC WHITELISTED TOKENS
        // Get whitelisted tokens
        //const account2 = '0x4c9972f2AA16B643440488a788e933c139Ff0323';
        const allTokens: Token[] = await getHyperSonicTokens();
        // Validate input token
        const tokenFoundA = allTokens.find(
          (i) => i.token.symbol === params.inToken,
        );
        if (!tokenFoundA) {
          console.log('Token from not found', true);
          return { success: false, error: 'IN TOKEN NOT FOUND' };
        }

        // Validate output token

        const tokenFoundB = allTokens.find(
          (i) => i.token.symbol === params.outToken,
        );
        if (!tokenFoundB) {
          console.log('Token to not found', true);
          return { success: false, error: 'OUTPUT TOKEN NOT FOUND' };
        }
        console.log('Found token is', tokenFoundA);
        console.log('parameters', params);
        const chainId = '146';
        const amountInWei = parseUnits(params.inAmount, 18);

        // Get quote from Hypersonic API
        const quoteResponse = await axios.post(
          'https://api.hypersonic.exchange/v1/quote',
          {
            chainId: chainId, //inTokenDetails.data.chainId,
            inToken: tokenFoundA?.token.tokenAddress, //inTokenDetails.data.tokenAddress,
            outToken: tokenFoundB?.token.tokenAddress,
            inAmount: amountInWei.toString(),
            slippage: 2.5, // Using 2.5% slippage - recommended for good surfing Sonic speed 💥
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );

        if (!quoteResponse.data.success) {
          console.log(
            `Failed to get quote: ${quoteResponse.data.error || 'Unknown error'}`,
          );
          return {
            success: false,
            error: quoteResponse.data.error || 'Unknown error',
          };
        }
        const quoteData = quoteResponse.data.data;

        console.log('Building swap transaction...');

        // Check and prepare approve transaction if needed
        if (
          tokenFoundA.token.tokenAddress !==
          '0x0000000000000000000000000000000000000000'
        ) {
          const userBalance = (await testPublicClient.readContract({
            abi: erc20Abi,
            address: tokenFoundA?.token.tokenAddress as Address,
            functionName: 'balanceOf',
            args: [account?.address as Address],
          })) as bigint;
          if (userBalance < amountInWei) {
            console.log(
              `Insufficient wS balance. Have ${formatUnits(userBalance, 18)}, want to deposit ${params.inAmount}`,
            );
            console.log('my account address', account?.address);
            return { success: false, error: 'NOT_ENOUGH_BALANCE' }; // ✅ Stop execution
          }
          console.log('User balance is', userBalance); // ✅ Check allowance before approving
          console.log('my current wallet address', account?.address);
          const currentAllowance = (await testPublicClient.readContract({
            abi: erc20Abi,
            address: tokenFoundA?.token.tokenAddress as Address,
            functionName: 'allowance',
            args: [account?.address as Address, HYPERSONIC_ROUTER_ADDRESS],
          })) as bigint;

          if (currentAllowance < amountInWei) {
            console.log(
              `Current allowance: ${formatUnits(currentAllowance, 18)}. Approving more...`,
            );
            const props: ApproveProps = {
              amount: params.inAmount,
              target: tokenFoundA?.token.tokenAddress as Address,
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
        }

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
          return {
            success: false,
            error: buildResponse.data.error || 'Unknown error',
          };
        }

        // Create transaction object
        const txObject = {
          account: account!,
          to: buildResponse.data.to,
          data: buildResponse.data.data,
          value: buildResponse.data.value,
          chain: sonic,
          // Optional: you can specify gas parameters or leave them to be estimated
        };
        // Send the transaction
        const hash = await walletClient!.sendTransaction(txObject);
        const message =
          `Quote for ${formatUnits(BigInt(params.inAmount), quoteData.inDecimals)} ${params.inToken} to ${params.outToken}:\n` +
          `Expected output: ${formatUnits(quoteData.outAmount, quoteData.outDecimals)} ${params.outToken}\n` +
          `Minimum received: ${formatUnits(quoteData.minReceived, quoteData.outDecimals)} ${params.outToken}\n` +
          `Transaction Hash: ${hash}`;
        console.log(`Transaction sent with hash: ${hash}`);
        return { success: true, data: message };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Uknown error',
        };
      }
    },

    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: Token[];
        error?: string;
      };

      if (!typedResult.success) {
        return (
          <div className="relative overflow-hidden rounded-2xl bg-destructive/5 p-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-destructive">
                Error: {typedResult.error}
              </p>
            </div>
          </div>
        );
      }
      if (!typedResult.data?.length) {
        return (
          <div className="relative overflow-hidden rounded-2xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">No tokens found</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          <h1>Token swap results card will be here</h1>
        </div>
      );
    },
  },
};

export const hyperSonicTools = {
  ...tokens,
  ...quote,
  ...swap,
};
