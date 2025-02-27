import { revalidatePath } from 'next/cache';

import { z } from 'zod';

interface SiloRewards {
  xpPerDollarDeposit: number;
  xpPerDollarBorrow: number;
  sTokenRewardAPR: number;
  sonicXpMultiplier: number;
  sonicXpMultiplierAction: string;
}

interface Silo {
  name: string;
  siloAddress: string;
  aprBorrow: string;
  aprDeposit: string;
  availableToBorrow: string;
  siloRewards: SiloRewards;
  token: {
    name: string;
    symbol: string;
    logo: string;
    tokenAddress: string;
  };
}
export interface MarketSchema {
  id: string;
  name: string;
  baseSiloId: string;
  bridgeSiloId: string;
  tvl: string;
  protocolFee: string;
  marketId: string;
  volume: string;
  platformId: string;
  platform: {
    name: string;
  };
  baseSilo: Silo;
  bridgeSilo: Silo;
}

interface MarketQueries {
  marketName?: string;
  bridgeAsset?: string;
  baseAsset?: string;
}

const rewardObject = z.object({
  xpPerDollarDeposit: z.number(),
  xpPerDollarBorrow: z.number(),
  sTokenRewardAPR: z.number(),
  sonicXpMultiplier: z.number(),
  sonicXpMultiplierAction: z.string(),
});

const siloSchema = z.object({
  name: z.string(),
  siloAddress: z.string(),
  aprBorrow: z.string(),
  aprDeposit: z.string(),
  availableToBorrow: z.string(),
  siloRewards: rewardObject,
  token: z.object({
    name: z.string(),
    symbol: z.string(),
    logo: z.string(),
    tokenAddress: z.string(),
  }),
});
const marketSchema = z.object({
  id: z.string(),
  name: z.string(),
  baseSiloId: z.string(),
  bridgeSiloId: z.string(),
  tvl: z.string(),
  protocolFee: z.string(),
  marketId: z.string(),
  volume: z.string(),
  platformId: z.string(),
  platform: z.object({
    name: z.string(),
  }),
  baseSilo: siloSchema,
  bridgeSilo: siloSchema,
});

const marketsSchema = z.object({
  data: z.object({
    items: z.array(marketSchema),
  }),
});

export const getMarkets = async (
  params?: MarketQueries,
): Promise<MarketSchema[]> => {
  try {
    /*const queryParams = new URLSearchParams({
      symbol,
    }).toString();*/

    const queryParams = new URLSearchParams();

    if (params?.marketName) {
      queryParams.append('marketName', params?.marketName); // ✅ Ensures symbol is only added if defined
    }
    const response = await fetch(
      `http://localhost:5000/api/v1/markets/get-markets?` + queryParams,
      {
        next: {
          revalidate: 300, // Cache for 5 minutes
        },
        // cache: 'no-store',
      },
    );

    const data = await response.json();
    //const parsed = birdeyeTradersSchema.parse(data);
    console.log('data', data);
    let parsed; // Declare parsed outside the try-catch block
    console.log('parsed data', parsed);
    try {
      // Attempt to parse the data
      parsed = marketsSchema.parse(data); // This will be accessible outside the try block
    } catch (error) {
      // Handle validation errors specifically
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
      } else {
        // Handle other errors (network, fetch, etc.)
        console.error('Error fetching pool markets:', error);
      }
      return []; // Return an empty array or handle the error case appropriately
    }

    // Only return the fields we need
    return await Promise.all(
      parsed.data.items.map(async (market) => ({
        id: market.id,
        name: market.name,
        baseSiloId: market.baseSiloId,
        bridgeSiloId: market.bridgeSiloId,
        tvl: market.tvl,
        protocolFee: market.protocolFee,
        marketId: market.protocolFee,
        volume: market.volume,
        platformId: market.platformId,
        platform: market.platform,
        baseSilo: market.baseSilo,
        bridgeSilo: market.bridgeSilo,
      })),
    );
  } catch (error) {
    console.error('Error fetching pool markets:', error);
    return [];
  }
};
