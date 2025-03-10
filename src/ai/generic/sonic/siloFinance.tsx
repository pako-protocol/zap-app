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
import { z } from 'zod';

import { routerAbi, siloAbi } from '@/abis';
import MraketCard from '@/components/sonic/market-card';
import PositionCard from '@/components/sonic/position-card';
import TokenCard from '@/components/sonic/token-card';
import { ROUTER_ADDRESS } from '@/lib/constants';
import { ApproveProps, approveTokens } from '@/lib/sonic/approveAllowance';
import { testPublicClient } from '@/lib/sonic/sonicClient';
import { getViemProvider } from '@/server/actions/ai';
import { MarketSchema, getMarkets } from '@/server/actions/getMarkets';
import { RewardSchema, getSiloRewards } from '@/server/actions/getSiloRewards';
import { PoolToken, getPoolTokens } from '@/server/actions/getTokens';
import {
  PositionSchema,
  getUserPositions,
} from '@/server/actions/getUserPositions';
import { formatForURL } from '@/server/utils';

export interface SimulationResults {
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
  hash?: string;
}

const account2 = '0x4c9972f2AA16B643440488a788e933c139Ff0323';

const tokens = {
  searchToken: {
    displayName: '🔍 Search Token',
    description:
      'Search for any Sonic token by name or symbol to get its contract address symbol name, along with detailed information like connected market pools/silos eg(5 pools/valut where it has big deposit apr) and logo. Useful for getting token addresses for further operations.',
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
            <TokenCard key={token.tokenAddress} token={token} />
          ))}
        </div>
      );
    },
  },
};

const markets = {
  getMarket: {
    displayName: 'Get Market Data 📊',
    description:
      'Fetch market data using market name, base asset, or bridge asset. Retrieve details including silo rewards',
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
        const marketsData = await getMarkets(filters);
        console.log('This is markets data', marketsData);
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
              <p className="text-sm text-muted-foreground">No Market found</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {typedResult.data.map((market, index) => (
            <MraketCard key={index} market={market} />
          ))}
        </div>
      );
    },
  },
};

const allMarkets = {
  getAvailableMarkets: {
    displayName: '🌐 Get silo finance markets',
    description:
      'Fetch all available markets on SiloFinance, including reward details for each Silo',
    parameters: z.object({
      addresss: z.string().describe('User wallet address'),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const marketsData = await getMarkets();
        console.log('available markets', marketsData);
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
            <MraketCard key={index} market={market} />
          ))}
        </div>
      );
    },
  },
};

const platformMarkets = {
  getMarketsByPlatform: {
    displayName: '🌐 Get markets by platform',
    description:
      'Retrieve a list of available markets from a specific DeFi platform, such as Aave, Compound, or Silo Finance. The user must specify the platform name to get details about the markets and asset pairs available on that platform',
    parameters: z.object({
      platformName: z
        .string()
        .describe('Market Name (e.g., "stS-S", "S-USDC")'),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      let platformName;
      if (params.platformName) {
        const formatted = formatForURL(params.platformName);
        platformName = formatted;
      }
      try {
        const filters: any = {
          platformName: platformName,
        };

        const marketsData = await getMarkets(filters);
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
            <MraketCard key={index} market={market} />
          ))}
        </div>
      );
    },
  },
};

const marketById = {
  getMarketName: {
    displayName: '🌐 Get market by name',
    description:
      'Retrieve details of a specific market on siloFinance using its name.',
    parameters: z.object({
      marketId: z.string().describe('Market Name (e.g., "stS-S", "S-USDC")'),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const filters: any = {
          marketId: params.marketId,
        };

        const marketsData = await getMarkets(filters);
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
            <MraketCard key={index} market={market} />
          ))}
        </div>
      );
    },
  },
};

// GET SILO REWARD

const siloRewards = {
  getSiloRewards: {
    displayName: '🌐 Get silo rewards',
    description:
      'Fetch reward details for a specific Silo on SiloFinance, including accrued incentives. Use \`getMarketByName\` to identify the correct Silo and its details',
    parameters: z.object({
      siloAddress: z
        .string()
        .describe('silo contract Address which to fetch reward details'),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const filters: any = {
          siloId: params.siloAddress,
        };
        console.log('Getreward params', params);
        const rewardsData = await getSiloRewards(filters);
        return {
          success: true,
          data: rewardsData,
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
        data?: RewardSchema;
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
      if (!typedResult) {
        return (
          <div className="relative overflow-hidden rounded-2xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                No Result something might be went wrong
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          <h2>Rewards card will be sen here</h2>
          <h2>
            StokenRewards : {typedResult.data?.siloRewards.sTokenRewardAPR}
          </h2>
          <h2>sonicXX : {typedResult.data?.siloRewards.sonicXpMultiplier}</h2>
          <h2>
            xPer dollar : {typedResult.data?.siloRewards.xpPerDollarBorrow}
          </h2>
          <h2>
            x perDeposit{typedResult.data?.siloRewards.xpPerDollarDeposit}
          </h2>
        </div>
      );
    },
  },
};

const deposit = {
  depositToken: {
    displayName: '🏦 Deposit token to Silo',
    description:
      'Deposits a specified amount of a token into @siloFinance platform using the provided market ID. use \`getMarket\` tool to et correct market data',

    parameters: z.object({
      address: z.string().describe('User Wallet Address'),
      assetAddress: z.string().describe('Token Address to deposit'),
      amount: z.string().describe('Amount of token to deposit'),
      marketAddress: z.string().describe('Silo Market contract address'),
    }),

    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const { walletClient, account } = await getViemProvider();
        const amountInWei = parseUnits(params.amount, 18);

        if (amountInWei === BigInt(0)) {
          console.log('Amount must be greater than 0');
          return { success: false, error: 'Amount must be greater than 0' };
        }

        const userBalance = (await testPublicClient.readContract({
          abi: erc20Abi,
          address: params.assetAddress as Address,
          functionName: 'balanceOf',
          args: [account?.address as Address],
        })) as bigint;

        if (userBalance < amountInWei) {
          console.log(
            `Insufficient balance. Have ${formatUnits(userBalance, 18)}, want to deposit ${params.amount}`,
          );
          return { success: false, error: 'NOT_ENOUGH_BALANCE' }; // ✅ Stop execution
        }

        console.log(
          `These are arguements  amount is ${params.amount} and asset address is ${params.assetAddress} and user address is ${params.address} and market address is ${params.marketAddress}`,
        );
        // ✅ Check allowance before approving
        const currentAllowance = (await testPublicClient.readContract({
          abi: erc20Abi,
          address: params.assetAddress as Address,
          functionName: 'allowance',
          args: [account?.address as Address, ROUTER_ADDRESS],
        })) as bigint;

        console.log('current allowance', currentAllowance);
        if (currentAllowance < amountInWei) {
          console.log(
            `Current allowance: ${formatUnits(currentAllowance, 18)}. Approving more...`,
          );
          const props: ApproveProps = {
            amount: params.amount,
            target: params.assetAddress as Address,
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

          account: account,
        });
        console.log('REACHED TOKEN TRANSCTIONS PART');
        const hash = await walletClient!.writeContract(request);
        const returnData = {
          request,
          params,
          txHash: hash,
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
          <h1>Tx Hash: {typedResult.data?.hash}</h1>
        </div>
      );
    },
  },
};

const withdraw = {
  withdrawToken: {
    displayName: '🏦 Withdraw Fund',
    description:
      "Withdraw a specified amount of tokens from the user's lending position. The user must specify the token, amount, and market name (e.g., ETH-USDC).",

    parameters: z.object({
      address: z.string().describe('User Wallet address'),
      recieverAddress: z.string().describe('Reciever Wallet Address'),
      assetAddress: z
        .string()
        .describe('the contract address of the token to withdraw.'),
      amount: z.string().describe('amount of tokens to withdraw.'),
      marketAddress: z
        .string()
        .describe('the contract address of the Silo market or pool'),
    }),

    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const { account, walletClient } = await getViemProvider();

        const amountInWei = parseUnits(params.amount, 18);
        if (amountInWei === BigInt(0)) {
          console.log('Amount must be greater than 0');
          return { success: false, error: 'Amount must be greater than 0' };
        }

        const maxWithdrawAmount = (await testPublicClient.readContract({
          abi: siloAbi,
          address: params.marketAddress as Address,
          functionName: 'maxWithdraw',
          args: [params.address as Address],
        })) as bigint;

        if (maxWithdrawAmount < amountInWei) {
          console.log(
            `Insufficient withdraw amount. Have ${formatUnits(maxWithdrawAmount, 18)}, want to withdraw ${params.amount}`,
            true,
          );
          return { success: false, error: 'Insufficient withdraw amount' }; // ✅ Stop execution
        }

        const collateralType = 1;

        console.log('Waiting for transaction confirmation...');
        const { request } = await testPublicClient.simulateContract({
          address: params.marketAddress as Address,
          abi: siloAbi,
          functionName: 'withdraw',
          args: [
            amountInWei,
            params.address as Address,
            params.address as Address,
            collateralType,
          ],
          account: account,
        });

        const hash = await walletClient!.writeContract(request);

        const returnData = {
          request,
          params,
          txHash: hash,
        };
        return {
          success: true,
          data: returnData,
        };
      } catch (error) {
        console.log('Error ithdarw with params', params);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to withdraw Token',
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
        console.log('Excecutation error', typedResult.error);
        console.log('Excecutation params');

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
          <h1>Tx Hash: {typedResult.data?.hash}</h1>
        </div>
      );
    },
  },
};
const borrow = {
  borrowToken: {
    displayName: '🏦Borrow token from Silo finance',
    description:
      'Borrow a specified amount of tokens from a lending market on Silo Finance. The user must provide the token contract address, the amount to borrow, and the Silo market/pool name. The tool executes the borrow transaction and returns a confirmation or error message.',

    parameters: z.object({
      address: z.string().describe('User Wallet address'),
      recieverAddress: z.string().describe('Reciever Wallet Address'),
      assetAddress: z
        .string()
        .describe('Contract address of the token to borrow from'), //Contract address of the token to borrow from
      amount: z.string().describe('Amount of token to Withdraw'),
      marketAddress: z
        .string()
        .describe('Silo market or pool contract address borrowing from'),
      //.default('0x396922EF30Cf012973343f7174db850c7D265278'),
    }),

    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const amountInWei = parseUnits(params.amount, 18);
        const { account, walletClient } = await getViemProvider();
        if (amountInWei === BigInt(0)) {
          console.log('Amount must be greater than 0');
          return { success: false, error: 'Amount must be greater than 0' };
        }

        const maxBorrow = (await testPublicClient.readContract({
          address: params.marketAddress as Address,
          abi: siloAbi,
          functionName: 'maxBorrow',
          args: [params.address],
        })) as bigint;

        if (maxBorrow < amountInWei) {
          console.log(
            `Insufficient withdraw amount. Have ${formatUnits(maxBorrow, 18)}, want to withdraw ${params.amount}`,
            true,
          );
          return { success: false, error: 'Insufficient withdraw amount' }; // ✅ Stop execution
        }

        const { request } = await testPublicClient.simulateContract({
          address: params.marketAddress as Address,
          abi: siloAbi,
          functionName: 'borrow',
          args: [amountInWei, params.address, params.address],
          account: account,
        });

        const hash = await walletClient!.writeContract(request);
        const returnData = {
          request,
          params,
          txHash: hash,
        };
        return {
          success: true,
          data: returnData,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to withdraw Token',
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
          <h1>Tx Hash: {typedResult.data?.hash}</h1>
        </div>
      );
    },
  },
};

const repay = {
  repayLoan: {
    displayName: '🏦Repay loan',
    description:
      'Repay a specified amount of borrowed tokens in a lending market on Silo Finance. The user must provide the token name, amount to repay, and the Silo market/pool name or Id. The tool processes the repayment and returns a confirmation or error message',
    parameters: z.object({
      address: z.string().describe('User Wallet address'),
      assetAddress: z
        .string()
        .describe('Contract address of the token to repay the loan'),
      amount: z.string().describe('Amount of token to Repay'),
      marketAddress: z
        .string()
        .describe('Silo market or pool contract address repaying to'),
    }),

    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const amountInWei = parseUnits(params.amount, 18);
        const { account, walletClient } = await getViemProvider();
        if (amountInWei === BigInt(0)) {
          console.log('Amount must be greater than 0');
          return { success: false, error: 'Amount must be greater than 0' };
        }
        const userBlance = (await testPublicClient.readContract({
          abi: erc20Abi,
          address: params.assetAddress as Address,
          functionName: 'balanceOf',
          args: [params.address as Address],
        })) as bigint;

        if (userBlance < amountInWei) {
          console.log(
            `Insufficient Blance. Have ${formatUnits(userBlance, 18)}, want to repay ${params.amount}`,
            true,
          );
          return { success: false, error: 'Insufficient withdraw amount' }; // ✅ Stop execution
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
          const props: ApproveProps = {
            amount: params.amount,
            target: params.assetAddress as Address,
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
                silo: params.marketAddress,
                asset: params.assetAddress,
                options: options,
              },
            ],
          ],
          account: account,
        });
        const hash = await walletClient!.writeContract(request);

        const returnData = {
          request,
          params,
          txHash: hash,
        };
        return {
          success: true,
          data: returnData,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to withdraw Token',
        };
      }
    },

    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: SimulationResults;
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

      return (
        <div className="space-y-2">
          <h1>Tx Hash: {typedResult.data?.hash}</h1>
        </div>
      );
    },
  },
};

//  POSITIONS

const positions = {
  getUserPositions: {
    displayName: 'Get User Positions📊',
    description:
      "Retrieve the user's current positions in a specified market. The user must provide the market ID to fetch details of their open positions, including collateral and borrowed amounts. The tool returns a summary of the user's positions within the specified market.",
    parameters: z.object({
      marketId: z.string().describe('Market Name'),
      address: z.string().describe('user wallet address'),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const filters: any = {
          marketId: params.marketId,
          account: params.address,
        };

        /* if (params.baseAssetSymbol) {
          filters.baseAsset = { symbol: params.baseAssetSymbol };
        }

        if (params.bridgeAssetSymbol) {
          filters.bridgeAsset = { symbol: params.bridgeAssetSymbol };
        }*/
        const marketsData = await getUserPositions(filters);
        return {
          success: true,
          data: marketsData,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to search positions',
        };
      }
    },
    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: PositionSchema;
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
      if (!typedResult) {
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
          <PositionCard position={typedResult.data} />
        </div>
      );
    },
  },
};

export const siloFinanceTools = {
  ...repay,
  ...borrow,
  ...withdraw,
  ...positions,
  ...tokens,
  ...deposit,
  ...markets,
  ...allMarkets,
  ...platformMarkets,
  ...marketById,
};
