// utils/fetchOnChainData.ts
import { ethers } from 'ethers';

import { SILO_LENS_ADDRESS, SONIC_RPC_URL } from '@/lib/constants';
import prisma from '@/lib/prisma';

import LENS_ABI from '../../../../abis/lens.json';

const provider = new ethers.providers.JsonRpcProvider(SONIC_RPC_URL);
// INITIALIZE CONTRACT
const siloLens = new ethers.Contract(SILO_LENS_ADDRESS, LENS_ABI, provider);
export const handleAPRupdates = async () => {
  try {
    const silos = await prisma.silo.findMany();

    for (const silo of silos) {
      try {
        const borrowAPR = await siloLens.getBorrowAPR(silo.siloAddress);
        const depositAPR = await siloLens.getDepositAPR(silo.siloAddress);

        // Format values
        const borrowAPRPercentage =
          parseFloat(ethers.utils.formatUnits(borrowAPR, 18)) * 100;
        const depositAPRPercentage =
          parseFloat(ethers.utils.formatUnits(depositAPR, 18)) * 100;

        const borrowDecimal = parseFloat(borrowAPRPercentage.toFixed(2));
        const depositDecimal = parseFloat(depositAPRPercentage.toFixed(2));

        // Update database
        await prisma.silo.update({
          where: { siloAddress: silo.siloAddress },
          data: { aprBorrow: borrowDecimal, aprDeposit: depositDecimal },
        });

        console.log(`[cron/market] Updated APRs for ${silo.name}`);
      } catch (error) {
        console.error(`[cron/market] Failed to update ${silo.name}:`, error);
      }
    }

    console.log('Silos', silos);
  } catch (error) {
    console.error('Error fetching silos', error?.stack);
  }
};
