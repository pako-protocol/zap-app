'use client';

import React from 'react';

import axios from 'axios';
import BigNumber from 'bignumber.js';
import { Address, erc20Abi, formatUnits, parseUnits } from 'viem';

import { ichiVaultAbi, siloAbi } from '@/abis';
import MraketCard from '@/components/sonic/market-card';
import PositionCard from '@/components/sonic/position-card';
import TokenCard from '@/components/sonic/token-card';
import { Button } from '@/components/ui/button';
import { BORROWABLE_WS_DEPOSIT_ADDRESS } from '@/lib/constants';
import { addLiquidity } from '@/lib/sonic/addLiquidity';
import { approveTokens, checkAllowance } from '@/lib/sonic/approveAllowance';
import { borrowWS } from '@/lib/sonic/borrowWs';
import { depositWts } from '@/lib/sonic/depositWs';
import {
  decryptPrivateKeyEvm,
  generateEncryptedKeyPairEvm,
} from '@/lib/sonic/evm-wallet-generator';
import { fetchUserPosition } from '@/lib/sonic/fetchUserPositions';
import { getDepositedBalanceWs } from '@/lib/sonic/ftechDepositedAmount';
import { quote } from '@/lib/sonic/getQuote';
import { repayWS } from '@/lib/sonic/repay';
import { testPublicClient } from '@/lib/sonic/sonicClient';
import { fetchUserPointsStats } from '@/lib/sonic/sonicPoints';
import { swap } from '@/lib/sonic/swap';
import { withdrawSTS } from '@/lib/sonic/withdraw';
import { getHyperSonicTokens } from '@/server/actions/getHypersonicTokens';
import { getMarkets } from '@/server/actions/getMarkets';
import { getSiloRewards } from '@/server/actions/getSiloRewards';
import { getUserPoints } from '@/server/actions/getSonicPoints';
import { getPoolTokens } from '@/server/actions/getTokens';
import { getUserPositions } from '@/server/actions/getUserPositions';
import { getVaults } from '@/server/actions/getVaults';
import { revalidateMarkets } from '@/server/actions/revalidateCache';
import { getBotUsername } from '@/server/actions/telegram';
import { dbCheckAccessCodeStatus } from '@/server/db/queries';

export default function page() {
  const account = '0x4c9972f2AA16B643440488a788e933c139Ff0323';

  const testCheckBorrowBalance = async () => {
    const balance = await testPublicClient.getBalance({
      address: '0x4c9972f2AA16B643440488a788e933c139Ff0323',
    });
    console.log('Balance:', balance);
  };

  const encryptedKey = `ELjbYlvzDsiEawNLkyHjNkaeTW/o5RsiI8tc1GkcZHSSxhX0bn4RK5CpRbsWBJBN2L/+2fXfa3h2PWUwIlLNlQdU/IAskVwygVDmxHC6r+hUbvTtWE2vpWu9erFcSCng`;
  const handleGenerateEvm = async () => {
    try {
      const { publicKey, encryptedPrivateKey } =
        await generateEncryptedKeyPairEvm();
      console.log('this is public key', publicKey);
      console.log('This is encrypted pk', encryptedPrivateKey);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecrpt = async () => {
    const pvKey = await decryptPrivateKeyEvm(encryptedKey);
    console.log('private key', pvKey);
  };
  const props = {
    symbol: 'S',
  };

  const props2 = {
    marketName: 'stS-S',
  };
  const props3 = {
    marketId: '3',
    account: '0x0A408a7F76F206C7898227CDaC871f0E4D3e46eE', //'0x4c9972f2AA16B643440488a788e933c139Ff0323',
  };
  const handleFetchPollTokens = async () => {
    try {
      const tokens = await getPoolTokens(props);
      console.log('Tokens', tokens);
    } catch (error) {
      console.log('error when fetching', error);
    }
  };

  const handleFetchMarkets = async () => {
    try {
      const tokens = await getMarkets(props2);
      console.log('Tokens', tokens);
    } catch (error) {
      console.log('error when fetching', error);
    }
  };

  const handleFetchVaults = async () => {
    try {
      const yap = {
        vaultName: 'S-ETH',
      };
      const tokens = await getVaults(yap);
      console.log('Tokens', tokens);
    } catch (error) {
      console.log('error when fetching', error);
    }
  };

  const handleFetchUserPositions = async () => {
    try {
      const positions = await fetchUserPosition(props3);
      console.log('Positions', positions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetBotInfo = async () => {
    try {
      const bot = await getBotUsername();
      console.log(bot);
    } catch (error) {
      console.log(error);
    }
  };

  const accessCode = 'kabugu';
  const testAcessKey = async () => {
    try {
      const res = await fetch('/api/access-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode }),
      });

      const data = await res.json();
      console.log('access code results', data);
    } catch (error) {}
  };

  const handleTestBB = async () => {
    try {
      const res = await dbCheckAccessCodeStatus('kabugu');
      console.log('response', res);
    } catch (error) {
      console.log(error);
    }
  };

  const fakeToken = {
    name: 'fake',
    symbol: 'FYK',
    logo: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png',
    tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  };

  const fakeMarket = {
    name: 'ETH-S',
    baseSilo: {
      name: 'ETH',
      token: {
        name: 'ETH',
        symbol: 'S',
        logo: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
        tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
    },
    bridgeSilo: {
      name: 'S',
      token: {
        name: 'Sonic',
        symbol: 'S',
        logo: 'https://assets.coingecko.com/coins/images/52937/standard/token-beets-staked-sonic.png',
        tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
    },
    platform: {
      name: 'Silo finance',
    },
  };

  const fakePosition = {
    healthFactor: '1',
    borrowPowerUsed: '0',
    silo0: {
      collateralBalance: '2',
      debtBalance: '0',
      siloAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    },
    silo1: {
      collateralBalance: '0',
      debtBalance: '0',
      siloAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    },
  };

  const props5 = {
    amount0: '1',
    amount1: '0',
  };

  const testDeopistV5 = async () => {
    try {
      const amount0 = '2';
      const amount1 = '0';
      const allVaults = await getVaults();
      // Chcek vault availability
      const vault = '0x0f5AcFC6D67410232589265a71E80661d0352848';
      const account2 = '0x4c9972f2AA16B643440488a788e933c139Ff0323' as Address;
      const vaultFound = allVaults.find((i) => i.vaultAddress === vault);
      if (!vaultFound) {
        console.log('Vault not found');
        return { success: false, error: 'No vault found' };
      }
      console.log('Vault found', vaultFound);
      const amount0InWei = parseUnits(amount0, 18);
      const amount1InWei = parseUnits(amount1, 18);

      if (amount0InWei === BigInt(0) && amount1InWei === BigInt(0)) {
        console.log('Vault not found');
        return { success: false, error: 'Amount must be greater than 0' };
      }

      const token0Allowed = vaultFound.isToken0Allowed;
      const token1Allowed = vaultFound.isToken1Allowed;
      if (!token0Allowed || !token1Allowed) {
        let message = '';
        if (!token0Allowed) message += `(${vaultFound.token0.symbol}) `;
        if (!token1Allowed) message += `(${vaultFound.token1.symbol})`;
        message = `Vault token ${message} not allowed`;
        console.log(message);
      }

      // CHECK MAX AND MIN DEPOSIT

      const token0MaxDeposit = (await testPublicClient.readContract({
        address: vaultFound.vaultAddress as Address,
        abi: ichiVaultAbi,
        functionName: 'deposit0Max',
      })) as bigint;

      const token1MaxDeposit = (await testPublicClient.readContract({
        address: vaultFound.vaultAddress as Address,
        abi: ichiVaultAbi,
        functionName: 'deposit1Max',
      })) as bigint;

      if (amount0InWei > token0MaxDeposit || amount1InWei > token1MaxDeposit) {
        let message = 'Max deposit exceeded with ';
        if (amount0InWei > token0MaxDeposit) {
          const exceeded = BigInt(
            new BigNumber(amount0InWei.toString())
              .minus(token0MaxDeposit.toString())
              .toString(),
          );
          message += `(${formatUnits(exceeded, 18)} ${vaultFound.token0.symbol}) `;
        }
        if (amount1InWei > token1MaxDeposit) {
          const exceeded = BigInt(
            new BigNumber(amount1InWei.toString())
              .minus(token1MaxDeposit.toString())
              .toString(),
          );
          message += `(${formatUnits(exceeded, 18)} ${vaultFound.token1.symbol}) `;
        }
        console.log(message);
        return { success: false, error: message };
      }
      // Validate token balance
      const token0Balance = await testPublicClient.readContract({
        address: vaultFound.token0.tokenAddress as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account2],
      });
      console.log('Token 0 balance');
      const token1Balance = await testPublicClient.readContract({
        address: vaultFound.token1.tokenAddress as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account2],
      });

      if (token0Allowed && token0Balance < amount0InWei) {
        console.log('Not enough balance');
        return { success: false, error: 'Not enough balance' };
      }

      if (token1Allowed && token1Balance < amount1InWei) {
        console.log('Not enough balance');
        return { success: false, error: 'Not enough balance' };
      }

      // ✅ Check allowance before approving
      if (token0Allowed) {
        const currentAllowance = (await testPublicClient.readContract({
          abi: erc20Abi,
          address: vaultFound.token0.tokenAddress as Address,
          functionName: 'allowance',
          args: [account2, vault as Address],
        })) as bigint;

        if (currentAllowance < amount0InWei) {
          console.log(
            `Current allowance: ${formatUnits(currentAllowance, 18)}. Approving more...`,
          );

          const args = {
            amount: amount0,
            target: vaultFound.token0.tokenAddress as Address,
            spender: vault as Address,
          };
          const approval = await approveTokens(args);
          if (approval?.success === false) {
            console.log('Token approval failed:', approval.error);
            return { success: false, error: 'Token approval failed' };
          }
        } else {
          console.log(
            `Allowance is sufficient: ${formatUnits(currentAllowance, 18)}`,
          );
        }
      }

      // ✅ Check allowance before approving
      console.log('Is token 1 allowed', token1Allowed);
      if (token1Allowed) {
        const currentAllowance = (await testPublicClient.readContract({
          abi: erc20Abi,
          address: vaultFound.token1.tokenAddress as Address,
          functionName: 'allowance',
          args: [account2, vault as Address],
        })) as bigint;

        if (currentAllowance < amount0InWei) {
          console.log(
            `Current allowance: ${formatUnits(currentAllowance, 18)}. Approving more...`,
          );

          const args = {
            amount: amount1,
            target: vaultFound.token1.tokenAddress as Address,
            spender: vault as Address,
          };
          const approval = await approveTokens(args);
          if (approval?.success === false) {
            console.log('Token approval failed:', approval.error);
            return { success: false, error: 'Token approval failed' };
          }
        } else {
          console.log(
            `Allowance is sufficient: ${formatUnits(currentAllowance, 18)}`,
          );
        }
      }

      // Deposit token

      const { request } = await testPublicClient.simulateContract({
        address: vault as Address,
        abi: ichiVaultAbi,
        functionName: 'deposit',
        args: [amount0InWei, amount1InWei, account2],
        account: account2,
      });

      const returnData = {
        request,
      };

      console.log('request details', request);
      console.log('status of tx is ', true);
      return {
        success: true,
        data: returnData,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add liq',
      };
    }
  };

  const handleGetSiloRewards = async () => {
    try {
      const params = {
        siloId: '0x322e1d5384aa4ED66AeCa770B95686271de61dc3',
      };
      const siloRewards = await getSiloRewards(params);
      console.log('silo rewardas', siloRewards);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetHypersonicTokens = async () => {
    try {
      const tokens = await getHyperSonicTokens();
      console.log('whitelisted', tokens);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOneToken = async () => {
    try {
      const tokens = await getHyperSonicTokens();
      const tokenFoundA = tokens.find((i) => i.symbol === 'S');
      console.log('whitelisted', tokens);
      console.log('cone token is', tokenFoundA);
    } catch (error) {
      console.log(error);
    }
  };

  const getSwapQuote = async () => {
    try {
      const pros = {
        inToken: 'S',
        outToken: 'wS',
        inAmount: '3',
      };
      const res = await quote(pros);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSwap = async () => {
    try {
      const pros = {
        inToken: 'wS',
        outToken: 'S',
        inAmount: '3',
      };
      const res = await swap(pros);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetPoinst = async () => {
    const parook = {
      walletAddress: '0x4c9972f2AA16B643440488a788e933c139Ff0323',
    };
    try {
      const points = await getUserPoints(parook);
      console.log('pOINTS IS HERE', points);
    } catch (error) {
      console.log('Point errors', error);
    }
  };
  return (
    <div>
      <Button onClick={() => depositWts('1')}>Deposit 1 ws</Button>
      <Button onClick={() => approveTokens('3')}>Approve 3 S</Button>

      <Button onClick={() => testCheckBorrowBalance()}>
        Check native balance
      </Button>

      <Button onClick={() => handleFetchUserPositions()}>
        Get user positions
      </Button>

      <Button onClick={() => getDepositedBalanceWs()}>
        Get silo 0 colleteral
      </Button>

      <Button onClick={() => borrowWS('0.5')}>Borrow 1 ws</Button>
      <Button onClick={() => handleGenerateEvm()}>Generate PK</Button>
      <Button onClick={() => handleDecrpt()}>Decrypt private keys</Button>
      <Button onClick={() => handleFetchPollTokens()}>
        Testtoken fetching
      </Button>
      <Button onClick={() => handleFetchMarkets()}>Test market fetching</Button>
      <Button onClick={() => handleGetBotInfo()}>Get bot info</Button>
      <Button onClick={() => borrowWS('50')}>Borrow tokens</Button>
      <Button onClick={() => repayWS('1')}>rEPAY LOAN</Button>
      <Button onClick={() => withdrawSTS('0.5')}>Withdrw Wts</Button>
      <Button onClick={() => testAcessKey()}>Test access code keys</Button>
      <Button onClick={() => handleTestBB()}>Test aain BB</Button>
      <form action={revalidateMarkets}>
        <Button>Revalidate markets</Button>
      </form>
      <Button onClick={() => addLiquidity(props5)}>Test Add liquidity</Button>
      <Button onClick={() => handleFetchVaults()}>Test Fetch vaults</Button>
      <Button onClick={() => testDeopistV5()}>Test Add liquidity V10</Button>
      <Button onClick={() => handleGetSiloRewards()}>GET SILO REWARDS</Button>
      <Button onClick={() => handleOneToken()}>hunt one tokens</Button>

      <Button onClick={() => checkAllowance()}>Check allowamce</Button>
      <Button onClick={() => handleGetHypersonicTokens()}>
        Get Tokens of hypersonic
      </Button>

      <Button onClick={() => getSwapQuote()}>Get quote</Button>
      <Button onClick={() => handleSwap()}>Builsd swap</Button>
      <Button onClick={() => handleGetPoinst()}>Get Xp Points</Button>

      <h1 className="my-5 font-semibold">TSTING CARDS</h1>

      <PositionCard position={fakePosition} />
    </div>
  );
}
