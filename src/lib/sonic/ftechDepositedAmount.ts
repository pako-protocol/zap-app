import { Address, formatUnits } from 'viem';

//import { FunctionReturn, toResult, getChainFromName, FunctionOptions } from '@heyanon/sdk';
import { S_USDC_MARKET_ID } from '../constants';
import { fetchUserPosition } from './ftechUserPositions';

interface Props {
  chainName: string;
  account: Address;
}

export async function getDepositedBalanceWs() {
  try {
    const { silo0 } = await fetchUserPosition();
    console.log(
      `Deposited wS balance: ${formatUnits(silo0.collateralBalance, 18)} wS`,
    );
  } catch (e) {
    console.log(`No borrowed wS amount found`);
  }
}
