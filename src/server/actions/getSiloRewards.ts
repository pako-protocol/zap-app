import { z } from 'zod';

interface SiloRewards {
  xpPerDollarDeposit: number;
  xpPerDollarBorrow: number;
  sTokenRewardAPR: number;
  sonicXpMultiplier: number;
}

export interface RewardSchema {
  //id: string;
  name: string;
  siloRewards: SiloRewards;
  aprBorrow: string;
  aprDeposit: string;
}

interface MarketQueries {
  siloId?: string;
}

const rewardObject = z.object({
  xpPerDollarDeposit: z.number(),
  xpPerDollarBorrow: z.number(),
  sTokenRewardAPR: z.number(),
  sonicXpMultiplier: z.number(),
});
const rewardSchema = z.object({
  name: z.string(),
  siloRewards: rewardObject,
  aprBorrow: z.string(),
  aprDeposit: z.string(),
});

export const getSiloRewards = async (
  params?: MarketQueries,
): Promise<RewardSchema | null> => {
  if (!params?.siloId) {
    console.error('Missing required parameters: marketId or account');
    return null;
  }

  const queryParams = new URLSearchParams();

  if (params?.siloId) {
    queryParams.append('siloId', params?.siloId); // ✅ Ensures symbol is only added if defined
  }
  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/markets/silo/rewards?` + queryParams,
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.data || !data.data.items) {
      console.error('❌ API response does not contain `data.items` key.');
      return null;
    }

    const parsedData = data.data.items; // ✅ Access `items` properly

    try {
      return rewardSchema.parse(parsedData);
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
