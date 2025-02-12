import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
  parseUnits,
} from 'viem';

import { routerAbi, stsAbi, wsAbi } from '@/abis';
import { TransactionParams } from '@/types/TxTypes';

//import { FunctionReturn, FunctionOptions, TransactionParams, toResult, getChainFromName, checkToApprove } from '@heyanon/sdk';
import {
  BORROWABLE_STS_DEPOSIT_ADDRESS,
  ROUTER_ADDRESS,
  STS_ADDRESS,
  S_BASE,
  WS_ADDRESS,
} from '../constants';
import { checkToApprove } from '../utils/sonic/checkToApprove';
import { account, testPublicClient, testWalletClient } from './sonicClient';

interface Props {
  chainName: string;
  account: Address;
  amount: string;
}

/**
 * Deposit stS tokens to Silo Finance
 * @param {Props} props - The properties to deposit stS tokens
 * @param {FunctionOptions} context - The function options
 * @returns Transaction result
 */
export async function depositWts(amount: string) {
  const account2 = '0x4c9972f2AA16B643440488a788e933c139Ff0323';

  console.log('Preparing to deposit stS tokens to Silo Finance...');

  try {
    const amountInWei = parseUnits(amount, 18);
    if (amountInWei === BigInt(0))
      console.log('Amount must be greater than 0', true);

    const stSBalance = (await testPublicClient.readContract({
      abi: wsAbi,
      address: WS_ADDRESS,
      functionName: 'balanceOf',
      args: [account2],
    })) as bigint;

    if (stSBalance < amountInWei) {
      console.log(
        `Insufficient wS balance. Have ${formatUnits(stSBalance, 18)}, want to deposit ${amount}`,
        true,
      );
    }

    const transactions: TransactionParams[] = [];

    // Check and prepare approve transaction if needed
    await checkToApprove({
      args: {
        account: account2,
        target: WS_ADDRESS,
        spender: ROUTER_ADDRESS,
        amount: amountInWei,
      },
      provider: testPublicClient,
      transactions,
    });

    // See https://github.com/silo-finance/silo-contracts-v2/blob/0.20.0/silo-core/contracts/interfaces/ISilo.sol#L47
    const collateralType = 1; // means Silo can use the stS as collateral
    const options = encodeAbiParameters(
      [
        { name: 'amount', type: 'uint256' },
        { name: 'ISilo.CollateralType', type: 'uint8' },
      ],
      [amountInWei, collateralType],
    );

    // See https://github.com/silo-finance/silo-contracts-v2/blob/0.20.0/silo-core/contracts/SiloRouter.sol#L21
    const depositActionType = 0;

    // Prepare deposit transaction
    /*const tx: TransactionParams = {
      target: ROUTER_ADDRESS,
      data: encodeFunctionData({
        abi: routerAbi,
        functionName: 'execute',
        args: [
          [
            depositActionType,
            BORROWABLE_STS_DEPOSIT_ADDRESS,
            STS_ADDRESS,
            options,
          ],
        ],
      }),
    };
    transactions.push(tx);*/

    console.log('Waiting for transaction confirmation...');

    // Prepare deposit transaction
    /*const depositTx = {
      address: ROUTER_ADDRESS,
      abi: routerAbi,
      functionName: 'execute',
      args: [
        [
          {
            actionType: depositActionType,
            silo: BORROWABLE_STS_DEPOSIT_ADDRESS,
            asset: STS_ADDRESS,
            options: options,
          },
        ],
      ],
  
    };*/

    // Simulate deposit execution
    const { request } = await testPublicClient.simulateContract({
      address: ROUTER_ADDRESS,
      abi: routerAbi,
      functionName: 'execute',
      args: [
        [
          {
            actionType: depositActionType,
            silo: S_BASE,
            asset: WS_ADDRESS,
            options: options,
          },
        ],
      ],

      account: account,
    });

    const hash = await testWalletClient.writeContract(request);
    console.log('The request', hash);
    console.log('The results', hash);
    //const result = await sendTransactions({ chainId, account, transactions });
    //const depositMessage = result.data[result.data.length - 1];
    //console.log('Tx Hash', hash);
    //return toResult(result.isMultisig ? depositMessage.message : `Successfully deposited ${amount} stS to Silo Finance. ${depositMessage.message}`);
  } catch (error) {
    console.log(error);
  }
}
