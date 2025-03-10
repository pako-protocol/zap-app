import axios from 'axios';

interface SiloUserPosition {
  siloAddress: string;
  collateralBalance: bigint;
  debtBalance: bigint;
}

interface UserPosition {
  silo0: SiloUserPosition;
  silo1: SiloUserPosition;
  healthFactor: bigint;
  borrowPowerUsed: bigint;
}

interface Params {
  marketId: string;
  account: string;
}
export async function fetchUserPosition(params: Params): Promise<UserPosition> {
  try {
    const response = await axios.get(
      `https://v2.silo.finance/api/lending-market/sonic/${params.marketId}?user=${params.account}`,
    );
    return {
      silo0: {
        siloAddress: response.data.silo0.siloAddress,
        collateralBalance: BigInt(response.data.silo0.collateralBalance),
        debtBalance: BigInt(response.data.silo0.debtBalance),
      },
      silo1: {
        siloAddress: response.data.silo1.siloAddress,
        collateralBalance: BigInt(response.data.silo1.collateralBalance),
        debtBalance: BigInt(response.data.silo1.debtBalance),
      },
      healthFactor: BigInt(response.data.healthFactor),
      borrowPowerUsed: BigInt(response.data.borrowPowerUsed),
    };
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to fetch user position: ${e.message}`);
    } else {
      throw new Error('Failed to fetch user position: Unknown error');
    }
  }
}
