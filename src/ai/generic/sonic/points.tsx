import { z } from 'zod';

import { TSonicUserPointsStats } from '@/lib/sonic/sonicPoints';
import { getUserPoints } from '@/server/actions/getSonicPoints';

const sonnicPoints = {
  getSonicPoints: {
    displayName: '🔍 Sonic Reward points',
    description:
      "Retrieve a user's Sonic reward points, including active liquidity points and ecosystem points",
    parameters: z.object({
      userWalletAddress: z.string().describe('The wallet address of the user'),
      walletAddress: z
        .string()
        .describe(
          'Wallet to check rewards for. Defaults to the connected wallet if not provided',
        )
        .optional(),
    }),
    execute: async function (
      params: z.infer<typeof this.parameters>,
    ): Promise<{ success: boolean; data?: any; error?: string }> {
      try {
        console.log('Params supplied', params);
        const filter = {
          walletAddress: params.walletAddress || params.userWalletAddress,
        };
        const points = await getUserPoints(filter);
        return {
          success: true,
          data: points,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Uknown Error',
        };
      }
    },
    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: TSonicUserPointsStats;
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
      if (!typedResult.data) {
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
          <h1>data is here</h1>
          <h3>{typedResult.data.active_liquidity_points}</h3>
        </div>
      );
    },
  },
};

export const rewardTools = {
  ...sonnicPoints,
};
