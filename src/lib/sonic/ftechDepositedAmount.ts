import { Address, formatUnits } from 'viem';

//import { FunctionReturn, toResult, getChainFromName, FunctionOptions } from '@heyanon/sdk';
import { S_USDC_MARKET_ID } from '../constants';
import { fetchUserPosition } from './fetchUserPositions';

interface Props {
  chainName: string;
  account: Address;
}

const props = {
  marketId: '3',
  account: '0x4c9972f2AA16B643440488a788e933c139Ff0323',
};
export async function getDepositedBalanceWs() {
  try {
    const { silo0 } = await fetchUserPosition(props);
    console.log(
      `Deposited wS balance: ${formatUnits(silo0.collateralBalance, 18)} wS`,
    );
  } catch (e) {
    console.log(`No borrowed wS amount found`);
  }
}
