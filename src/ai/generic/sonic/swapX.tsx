// ADD LIQUIDITY
// SHOW LIST OF VAULTS
// REMOVE LIQ
// SHOW MY LP POSITIONS
// STAKE LP TO GAUGE
// UNSTAKE LP GAUGE
// UNSTAKE LP GAUGE AND CLAIM REWARD
// SHOW GAUGE LP
// SHOW PENDING REWARDS
// Claim rewards from gauge in
// getLPBalance
import BigNumber from 'bignumber.js';
import { Address, erc20Abi, formatUnits, parseUnits } from 'viem';
import { z } from 'zod';

import { ichiVaultAbi } from '@/abis';
import { approveTokens } from '@/lib/sonic/approveAllowance';
import { testPublicClient } from '@/lib/sonic/sonicClient';
import { getViemProvider } from '@/server/actions/ai';
import { VaultSchema, getVaults } from '@/server/actions/getVaults';

import { SimulationResults } from './siloFinance';

// GET VAULT BY NAME
const vaults = {
  searchVault: {
    displayName: '🔍 Get Vault Details',
    description:
      'Retrieve details of a specific vault by its name, including supported assets, and contract addresses.',
    parameters: z.object({
      name: z.string().describe('Vault name to search for'),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const filters = {
          vaultName: params.name,
        };
        const vaultData = await getVaults(filters);
        return {
          success: true,
          data: vaultData,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to search Vault',
        };
      }
    },
    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: VaultSchema[];
        error?: string;
      };
      console.log('Vault results', typedResult);

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
              <p className="text-sm text-muted-foreground">No vault found</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {typedResult.data.map((vault, index) => (
            <div key={index}>
              <h1>{vault.name}</h1>
            </div>
          ))}
        </div>
      );
    },
  },
};
// GET VAULT BY PLATFORM
const allVaults = {
  getVaultsByPlatform: {
    displayName: '🔍 Search Vaults',
    description:
      'Fetch all available vaults on a specified platform. Returns a list of vaults associated with the platform name (e.g., SwapX, Uniswap)',
    parameters: z.object({
      name: z.string().describe('The name of the platform to search vaults on'),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const filters = {
          platformName: params.name,
        };
        const vaultData = await getVaults(filters);
        return {
          success: true,
          data: vaultData,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to search vaults',
        };
      }
    },
    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: VaultSchema[];
        error?: string;
      };
      console.log('Vault results', typedResult);

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
              <p className="text-sm text-muted-foreground">No vault found</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {typedResult.data.map((vault, index) => (
            <div key={index}>
              <h1>{vault.name}</h1>
            </div>
          ))}
        </div>
      );
    },
  },
};

// ADD LIQ
const addLiquidity = {
  depositLiquidity: {
    displayName: 'Provide Liquidity to a Vault',
    description:
      'Depoisit liquidity into a specified vault on a selected platform by supplying two token amounts and the vault’s contract address',
    parameters: z.object({
      platformName: z
        .string()
        .describe('The platform where liquidity is added'),
      account: z.string().describe("User's wallet address"),
      vault: z.string().describe("The vault's contract address"),
      amount0: z.string().describe('Amount of the first token.'),
      amount1: z.string().describe('Amount of the second token'),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        const { account } = await getViemProvider();
        const allVaults = await getVaults();
        // Chcek vault availability
        const account2 =
          '0x4c9972f2AA16B643440488a788e933c139Ff0323' as Address;
        const vaultFound = allVaults.find(
          (i) => i.vaultAddress === params.vault,
        );
        if (!vaultFound) {
          console.log('Vault not found');
          return { success: false, error: 'No vault found' };
        }

        const amount0InWei = parseUnits(params.amount0, 18);
        const amount1InWei = parseUnits(params.amount1, 18);

        if (amount0InWei === BigInt(0) && amount1InWei === BigInt(0)) {
          console.log('Vault not found');
          return { success: false, error: 'Amount must be greater than 0' };
        }

        const token0Allowed =
          vaultFound.isToken0Allowed || amount0InWei == BigInt(0);
        const token1Allowed =
          vaultFound.isToken1Allowed || amount1InWei == BigInt(0);
        if (!token0Allowed || !token1Allowed) {
          let message = '';
          if (!token0Allowed) message += `(${vaultFound.token0.symbol}) `;
          if (!token1Allowed) message += `(${vaultFound.token1.symbol})`;
          message = `Vault token ${message} not allowed`;
          console.log(message);
        }

        // CHECK MAX AND MIN DEPOSIT

        const token0MaxDeposit = (await testPublicClient.readContract({
          address: vaultFound.vaultAddress as Address,
          abi: ichiVaultAbi,
          functionName: 'deposit0Max',
        })) as bigint;

        const token1MaxDeposit = (await testPublicClient.readContract({
          address: vaultFound.vaultAddress as Address,
          abi: ichiVaultAbi,
          functionName: 'deposit1Max',
        })) as bigint;

        if (
          amount0InWei > token0MaxDeposit ||
          amount1InWei > token1MaxDeposit
        ) {
          let message = 'Max deposit exceeded with ';
          if (amount0InWei > token0MaxDeposit) {
            const exceeded = BigInt(
              new BigNumber(amount0InWei.toString())
                .minus(token0MaxDeposit.toString())
                .toString(),
            );
            message += `(${formatUnits(exceeded, 18)} ${vaultFound.token0.symbol}) `;
          }
          if (amount1InWei > token1MaxDeposit) {
            const exceeded = BigInt(
              new BigNumber(amount1InWei.toString())
                .minus(token1MaxDeposit.toString())
                .toString(),
            );
            message += `(${formatUnits(exceeded, 18)} ${vaultFound.token1.symbol}) `;
          }
          console.log(message);
          return { success: false, error: message };
        }
        console.log('used params', params);
        // Validate token balance
        const token0Balance = await testPublicClient.readContract({
          address: vaultFound.token0.tokenAddress as Address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [account2],
        });
        console.log('Token 0 balance');
        const token1Balance = await testPublicClient.readContract({
          address: vaultFound.token1.tokenAddress as Address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [account2],
        });

        if (token0Allowed && token0Balance < amount0InWei) {
          console.log('Not enough balance');
          return { success: false, error: 'Not enough balance' };
        }

        if (token1Allowed && token1Balance < amount1InWei) {
          console.log('Not enough balance');
          return { success: false, error: 'Not enough balance' };
        }

        // ✅ Check allowance before approving
        if (token0Allowed) {
          const currentAllowance = (await testPublicClient.readContract({
            abi: erc20Abi,
            address: vaultFound.token0.tokenAddress as Address,
            functionName: 'allowance',
            args: [account2, params.vault as Address],
          })) as bigint;

          if (currentAllowance < amount0InWei) {
            console.log(
              `Current allowance: ${formatUnits(currentAllowance, 18)}. Approving more...`,
            );

            const args = {
              amount: params.amount0,
              target: vaultFound.token0.tokenAddress as Address,
              spender: params.vault as Address,
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
            address: vaultFound.token1.tokenAddress as Address,
            functionName: 'allowance',
            args: [account2, params.vault as Address],
          })) as bigint;

          if (currentAllowance < amount0InWei) {
            console.log(
              `Current allowance: ${formatUnits(currentAllowance, 18)}. Approving more...`,
            );

            const args = {
              amount: params.amount1,
              target: vaultFound.token1.tokenAddress as Address,
              spender: params.vault as Address,
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
          address: params.vault as Address,
          abi: ichiVaultAbi,
          functionName: 'deposit',
          args: [amount0InWei, amount1InWei, account2],
          account: account2,
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
          error: error instanceof Error ? error.message : 'Failed to add liq',
        };
      }
    },
    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: SimulationResults[];
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
              <p className="text-sm text-muted-foreground">No vault found</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          <h1>Simulation results here</h1>
        </div>
      );
    },
  },
};

export const swapXTools = {
  ...allVaults,
  ...vaults,
  ...addLiquidity,
};
