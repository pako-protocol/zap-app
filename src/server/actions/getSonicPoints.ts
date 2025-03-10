import { z } from 'zod';

import { TSonicUserPointsStats } from '@/lib/sonic/sonicPoints';

const pointsSchema = z.object({
  user_activity_last_detected: z.string(),
  wallet_address: z.string(),
  sonic_points: z.number(),
  loyalty_multiplier: z.number(),
  ecosystem_points: z.number(),
  passive_liquidity_points: z.number(),
  active_liquidity_points: z.number(),
  rank: z.number(),
});

interface PositionQueriesSchema {
  walletAddress: string;
}

export const getUserPoints = async (
  params?: PositionQueriesSchema,
): Promise<TSonicUserPointsStats | null> => {
  if (!params?.walletAddress) {
    console.error('Missing required parameters: marketId or account');
    return null;
  }
  const OPENBLOCK_ENDPOINT = 'https://www.data-openblocklabs.com';
  try {
    const response = await fetch(
      `${OPENBLOCK_ENDPOINT}/sonic/user-points-stats?wallet_address=${params.walletAddress}`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    //console.log('Fetched data:', data);

    try {
      return pointsSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
      } else {
        console.error('Unexpected error during data parsing:', error);
      }
      return null;
    }
  } catch (error) {
    console.error('Error fetching user positions:', error);
    return null;
  }
};
