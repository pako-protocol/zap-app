import { z } from 'zod';

import { BACK_END } from '@/lib/constants';

interface Silo {
  name: string;
  aprDeposit: string;
  aprBorrow: string;
  siloAddress: string;
}

export interface PoolToken {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  tokenAddress: string;
  silos: Silo[];
}

const tokenSchema = z.object({
  name: z.string(),
  id: z.string(),
  symbol: z.string(),
  logo: z.string(),
  tokenAddress: z.string(),
  silos: z.array(
    z.object({
      name: z.string(),
      aprDeposit: z.string(),
      aprBorrow: z.string(),
      siloAddress: z.string(),
    }),
  ),
});

interface TokenQueries {
  symbol?: string;
}

const tokensSchema = z.object({
  data: z.object({
    items: z.array(tokenSchema),
  }),
});

export const getPoolTokens = async (
  params?: TokenQueries,
): Promise<PoolToken[]> => {
  try {
    /*const queryParams = new URLSearchParams({
      symbol,
    }).toString();*/

    const queryParams = new URLSearchParams();

    if (params?.symbol) {
      queryParams.append('symbol', params?.symbol); // ✅ Ensures symbol is only added if defined
    }
    const response = await fetch(
      `${BACK_END}tokens/get-tokens?` + queryParams,
      /* {
        next: {
          revalidate: 300, // Cache for 5 minutes
        },
      },*/
    );

    const data = await response.json();
    //const parsed = birdeyeTradersSchema.parse(data);
    console.log('data', data);
    let parsed; // Declare parsed outside the try-catch block
    console.log('parsed data', parsed);
    try {
      // Attempt to parse the data
      parsed = tokensSchema.parse(data); // This will be accessible outside the try block
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
        symbol: market.symbol,
        logo: market.logo,
        tokenAddress: market.tokenAddress, // Ensure this property matches the PoolToken type
        silos: market.silos.map((silo: any) => ({
          name: silo.name,
          aprDeposit: silo.aprDeposit,
          aprBorrow: silo.aprBorrow,
          siloAddress: silo.siloAddress,
        })),
      })),
    );
  } catch (error) {
    console.error('Error fetching pool markets:', error);
    return [];
  }
};
