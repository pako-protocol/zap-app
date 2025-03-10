import { z } from 'zod';

interface Silo {
  collateralBalance: string;
  debtBalance: string;
  siloAddress: string;
}

export interface PositionSchema {
  borrowPowerUsed: string;
  healthFactor: string;
  silo0: Silo;
  silo1: Silo;
}

const siloSchema = z.object({
  collateralBalance: z.string(),
  debtBalance: z.string(),
  siloAddress: z.string(), // Fixed type to match interface
});

const positionsSchema = z.object({
  borrowPowerUsed: z.string(),
  healthFactor: z.string(),
  silo0: siloSchema,
  silo1: siloSchema,
});

interface PositionQueriesSchema {
  marketId: string;
  account: string;
}

export const getUserPositions = async (
  params?: PositionQueriesSchema,
): Promise<PositionSchema | null> => {
  if (!params?.marketId || !params?.account) {
    console.error('Missing required parameters: marketId or account');
    return null;
  }

  try {
    const response = await fetch(
      `https://v2.silo.finance/api/lending-market/sonic/${params.marketId}?user=${params.account}`,
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
      return positionsSchema.parse(data);
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
