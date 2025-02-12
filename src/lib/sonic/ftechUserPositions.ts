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

export async function fetchUserPosition(
  chainName: string,
  //account: string,
  marketId: string,
): Promise<UserPosition> {
  const account = '0x4c9972f2AA16B643440488a788e933c139Ff0323';
  try {
    const response = await axios.get(
      `https://v2.silo.finance/api/lending-market/sonic/3?user=${account}`,
    );
    console.log('full response is ', response);
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
    throw new Error(`Failed to fetch user position: ${e?.message}`);
  }
}
