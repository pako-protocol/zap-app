import { revalidatePath } from 'next/cache';

import { Address } from 'viem';
import { z } from 'zod';

import { BACK_END } from '@/lib/constants';

interface Token {
  name: string;
  symbol: string;
  logo: string;
  tokenAddress: string;
}

interface Platform {
  name: string;
}
export interface VaultSchema {
  id: string;
  name: string;
  vaultAddress: string;
  vaultType: string;
  isToken0Allowed: boolean;
  isToken1Allowed: boolean;
  gauge: string;
  token0: Token;
  token1: Token;
  platformId: string;
  platform: Platform;
}

interface MarketQueries {
  vaultName?: string;
  platformName?: string;
}

const tokenSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  logo: z.string(),
  tokenAddress: z.string(),
});
const vaultSchema = z.object({
  id: z.string(),
  name: z.string(),
  vaultAddress: z.string(),
  vaultType: z.string(),
  isToken0Allowed: z.boolean(),
  isToken1Allowed: z.boolean(),
  gauge: z.string(),
  token0: tokenSchema,
  token1: tokenSchema,
  platformId: z.string(),
  platform: z.object({
    name: z.string(),
  }),
});

const marketsSchema = z.object({
  data: z.object({
    items: z.array(vaultSchema),
  }),
});

export const getVaults = async (
  params?: MarketQueries,
): Promise<VaultSchema[]> => {
  try {
    /*const queryParams = new URLSearchParams({
      symbol,
    }).toString();*/

    const queryParams = new URLSearchParams();

    if (params?.vaultName) {
      queryParams.append('vaultName', params?.vaultName); // ✅ Ensures symbol is only added if defined
    }
    const response = await fetch(
      `${BACK_END}vaults/get-vaults?` + queryParams,
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
        platformId: market.platformId,
        platform: market.platform,
        token0: market.token0,
        token1: market.token1,
        isToken0Allowed: market.isToken0Allowed,
        isToken1Allowed: market.isToken1Allowed,
        vaultType: market.vaultType,
        vaultAddress: market.vaultAddress,
        gauge: market.gauge,
      })),
    );
  } catch (error) {
    console.error('Error fetching pool markets:', error);
    return [];
  }
};
