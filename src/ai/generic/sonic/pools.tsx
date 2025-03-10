import { z } from 'zod';

import PoolCard from '@/components/sonic/pools/pool-card';
import { MarketPools, getPools } from '@/server/actions/getMarketPools';
import { getPoolTokens } from '@/server/actions/getTokens';

export const poolTools = {
  getPoolMarkets: {
    displayName: '🔍 Pool markets',
    description:
      'Find and return lending market pools (silos) from silo.finance a web3 lending platform ',

    parameters: z.object({
      chain: z.string().default('Sonic bockchain').describe('the blockchain'),
      platform: z
        .string()
        .default('silo finance')
        .describe('Lending platform name'),
    }),

    execute: async () => {
      try {
        const markets = await getPools();
        return {
          success: true,
          data: markets,
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
        data?: MarketPools[];
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
            <PoolCard key={index} market={market} />
          ))}
        </div>
      );
    },
  },
};
