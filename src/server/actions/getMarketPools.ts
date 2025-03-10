import { cache } from 'react';

import { z } from 'zod';

import { BACK_END } from '@/lib/constants';

export interface MarketPools {
  _id: string;
  id: number;
  address: string;
  name: string;
  protocolFee: string;
  silo0: {
    _id: string;
    name: string;
    logo: string;
    sonicXp: number;
    borrowAPR: string;
    depositAPR: string;
    utilization: number;
    maxLTV: string;
    maxLT: string;
    TVL: string;
    // liquadationFee: string;
    contractAddress: string;
    siloAddress: string;
  };
  silo1: {
    _id: string;
    name: string;
    logo: string;
    sonicXp: number;
    borrowAPR: string;
    depositAPR: string;
    utilization: number;
    maxLTV: string;
    maxLT: string;
    TVL: string;
    //liquadationFee: string;
    contractAddress: string;
    siloAddress: string;
  };
}

const poolMarketSchema = z.object({
  name: z.string(),
  id: z.number(),
  _id: z.string(),
  address: z.string(),
  protocolFee: z.string(),
  deployerAddress: z.string(),
  __v: z.number(),
  silo0: z.object({
    _id: z.string(),
    name: z.string(),
    logo: z.string(),
    sonicXp: z.number(),
    borrowAPR: z.string(),
    depositAPR: z.string(),
    utilization: z.number(),
    maxLTV: z.string(),
    maxLT: z.string(),
    TVL: z.string(),
    liquadationFee: z.string().optional(),
    contractAddress: z.string(),
    siloAddress: z.string(),
    __v: z.number(),
  }),

  silo1: z.object({
    _id: z.string(),
    name: z.string(),
    logo: z.string(),
    sonicXp: z.number(),
    borrowAPR: z.string(),
    depositAPR: z.string(),
    utilization: z.number(),
    maxLTV: z.string(),
    maxLT: z.string(),
    TVL: z.string(),
    liquadationFee: z.string().optional(),
    contractAddress: z.string(),
    siloAddress: z.string(),
    __v: z.number(),
  }),
});

const poolMarketsSchema = z.object({
  data: z.object({
    items: z.array(poolMarketSchema),
  }),
});

export const getPools = async (): Promise<MarketPools[]> => {
  try {
    const response = await fetch(
      `${BACK_END}market/get-markets`,
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
      parsed = poolMarketsSchema.parse(data); // This will be accessible outside the try block
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
        _id: market._id,
        id: market.id,
        address: market.address,
        name: market.name,
        protocolFee: market.protocolFee,
        silo0: market.silo0,
        silo1: market.silo1,
      })),
    );
  } catch (error) {
    console.error('Error fetching pool markets:', error);
    return [];
  }
};
