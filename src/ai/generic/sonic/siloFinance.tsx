//ALL  SILO OPERATIONS WILL BE SERVED HERE
//  - DEPOSIT ANY TOKEN
// WITHDRW ANY TOKEN
// CHECK POSITIONS
// REPAY
// GET OPPORUTUNITIES
// GET SOL MARKETS
import {
  Address,
  encodeAbiParameters,
  erc20Abi,
  formatUnits,
  parseUnits,
} from 'viem';
import { symbol, z } from 'zod';

import { routerAbi } from '@/abis';
import { ROUTER_ADDRESS } from '@/lib/constants';
import { approveTokens } from '@/lib/sonic/approveAllowance';
import { testPublicClient } from '@/lib/sonic/sonicClient';
import { MarketPools, getPools } from '@/server/actions/getMarketPools';
import { MarketSchema, getPoolMarkets } from '@/server/actions/getMarkets';
import { PoolToken, getPoolTokens } from '@/server/actions/getTokens';

interface SimulationResults {
  request: {
    address: string;
    account: {
      address: string;
      type: string;
    };
    functionName: string;
  };
  params: {
    amount: string;
    address: string;
    assetAddress: string;
    marketAddress: string;
  };
}

const fakeData = {
  address: '0x4c9972f2AA16B643440488a788e933c139Ff0323',
  account: {
    address: 'helllo',
    type: 'json rpc',
  },
  fuctionNmae: 'excecute',
  params: {},
};

const account2 = '0x4c9972f2AA16B643440488a788e933c139Ff0323';

const tokens = {
  searchToken: {
    displayName: '🔍 Search Token',
    description:
      'Search for any Sonic token by name or symbol to get its contract address symbol name, along with detailed information like connected market pools/ silos eg(5 pools/ valut where it has big deposit apr) and logo. Useful for getting token addresses for further operations.',
    parameters: z.object({
      query: z.string().describe('Token name or symbol to search for'),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const filters = {
          symbol: params.query,
        };
        const tokensData = await getPoolTokens(filters);
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
        data?: PoolToken[];
        error?: string;
      };
      console.log('Token results', typedResult);

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
              <p className="text-sm text-muted-foreground">No traders found</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {typedResult.data.map((token, index) => (
            <div key={index}>
              <h1>Toke name : {token.name}</h1>
            </div>
          ))}
        </div>
      );
    },
  },
};

const markets = {
  getPoolMarket: {
    displayName: 'Get Market Data 📊',
    description:
      'Fetch market data using market name, base asset, or bridge asset. Retrieve details such as base silo, bridge silo, and supported tokens for comprehensive market insights.',
    parameters: z.object({
      marketName: z.string().describe('Market Name (e.g., "stS-S", "S-USDC")'),
      baseAssetSymbol: z
        .string()
        .describe("market base asset (e.g., 'S')")
        .optional(),
      bridgeAssetSymbol: z
        .string()
        .describe("market bridge asset (e.g., 'USDC')")
        .optional(),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const filters: any = {
          marketName: params.marketName,
        };

        /* if (params.baseAssetSymbol) {
          filters.baseAsset = { symbol: params.baseAssetSymbol };
        }

        if (params.bridgeAssetSymbol) {
          filters.bridgeAsset = { symbol: params.bridgeAssetSymbol };
        }*/
        const marketsData = await getPoolMarkets(filters);
        return {
          success: true,
          data: marketsData,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to search markets',
        };
      }
    },
    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: MarketSchema[];
        error?: string;
      };
      console.log('Token results', typedResult);

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
              <p className="text-sm text-muted-foreground">No traders found</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {typedResult.data.map((market, index) => (
            <div key={index}>
              <h1>Toke name : {market.name}</h1>
              <h1>Platform name : {market.platform.name}</h1>
              <p>market silo address {market.baseSilo.siloAddress}</p>
            </div>
          ))}
        </div>
      );
    },
  },
};

// WILL BE  APPLIED LATER

const allMarkets = {
  getAllPollMarkets: {
    displayName: '🌐 All Markets Overview',
    description:
      'Get a complete list of all markets within the platform. Includes insights on base and bridge assets, supported tokens, and liquidity.',
    parameters: z.object({
      name: z.string().describe('Market Name (e.g., "stS-S", "S-USDC")'),
      baseAssetSymbol: z
        .string()
        .describe("market base asset (e.g., 'S')")
        .optional(),
      bridgeAssetSymbol: z
        .string()
        .describe("market bridge asset (e.g., 'USDC')")
        .optional(),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const filters: any = {
          symbol: params.name,
        };

        if (params.baseAssetSymbol) {
          filters.baseAsset = { symbol: params.baseAssetSymbol };
        }

        if (params.bridgeAssetSymbol) {
          filters.bridgeAsset = { symbol: params.bridgeAssetSymbol };
        }
        const marketsData = await getPoolMarkets(filters);
        return {
          success: true,
          data: marketsData,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to search markets',
        };
      }
    },
    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: MarketSchema[];
        error?: string;
      };
      console.log('Token results', typedResult);

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
              <p className="text-sm text-muted-foreground">No traders found</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {typedResult.data.map((market, index) => (
            <div key={index}>
              <h1>Toke name : {market.name}</h1>
              <h1>Platform name : {market.platform.name}</h1>
              <p>market silo address {market.baseSilo.siloAddress}</p>
            </div>
          ))}
        </div>
      );
    },
  },
};

const deposit = {
  depositToken: {
    displayName: '🏦 Deposit token to Silo',
    description:
      'Deposits a specified amount of a token into the Silo Finance platform using the provided market ID. The AI will use the token symbol and market ID to determine the correct lending market for the deposi',

    parameters: z.object({
      address: z.string().describe('User Wallet Address'),
      assetAddress: z.string().describe('Token Address to deposit'),
      //.default('0xE5DA20F15420aD15DE0fa650600aFc998bbE3955'),
      amount: z.string().describe('Amount of token to deposit'),
      marketAddress: z.string().describe('Silo Market contract address'),
      //.default('0x396922EF30Cf012973343f7174db850c7D265278'),
    }),

    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      console.log(
        `These are arguements  amount is ${params.amount} and asset address is ${params.assetAddress} and user address is ${params.address} and market address is ${params.marketAddress}`,
      );
      try {
        const amountInWei = parseUnits(params.amount, 18);

        if (amountInWei === BigInt(0)) {
          console.log('Amount must be greater than 0');
          return { success: false, error: 'Amount must be greater than 0' };
        }

        const userBalance = (await testPublicClient.readContract({
          abi: erc20Abi,
          address: params.assetAddress as Address,
          functionName: 'balanceOf',
          args: [params.address as Address],
        })) as bigint;

        if (userBalance < amountInWei) {
          console.log(
            `Insufficient balance. Have ${formatUnits(userBalance, 18)}, want to deposit ${params.amount}`,
          );
          return { success: false, error: 'NOT_ENOUGH_BALANCE' }; // ✅ Stop execution
        }

        // ✅ Check allowance before approving
        const currentAllowance = (await testPublicClient.readContract({
          abi: erc20Abi,
          address: params.assetAddress as Address,
          functionName: 'allowance',
          args: [params.address as Address, ROUTER_ADDRESS],
        })) as bigint;

        if (currentAllowance < amountInWei) {
          console.log(
            `Current allowance: ${formatUnits(currentAllowance, 18)}. Approving more...`,
          );
          const approval = await approveTokens(params.amount);
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
        const depositActionType = 0;
        const options = encodeAbiParameters(
          [
            { name: 'amount', type: 'uint256' },
            { name: 'ISilo.CollateralType', type: 'uint8' },
          ],
          [amountInWei, collateralType],
        );

        console.log('Waiting for transaction confirmation...');
        const { request } = await testPublicClient.simulateContract({
          address: ROUTER_ADDRESS,
          abi: routerAbi,
          functionName: 'execute',
          args: [
            [
              {
                actionType: depositActionType,
                silo: params.marketAddress,
                asset: params.assetAddress,
                options: options,
              },
            ],
          ],

          account: params.address as Address,
        });

        const returnData = {
          request,
          params,
        };
        return {
          success: true,
          data: returnData,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to search markets',
        };
      }
    },

    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: SimulationResults;
        error?: string;
      };
      console.log("I'm  pools result from the Tool", result);
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

      return (
        <div className="space-y-2">
          <h1>This is the result of simulation</h1>
        </div>
      );
    },
  },
};

export const siloFinanceTools = {
  ...tokens,
  ...deposit,
  ...markets,
};
