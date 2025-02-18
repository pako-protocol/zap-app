'use client';

import React from 'react';

import { siloAbi } from '@/abis';
import { Button } from '@/components/ui/button';
import { BORROWABLE_WS_DEPOSIT_ADDRESS } from '@/lib/constants';
import { approveTokens } from '@/lib/sonic/approveAllowance';
import { borrowWS } from '@/lib/sonic/borrowWs';
import { depositWts } from '@/lib/sonic/depositWs';
import {
  decryptPrivateKeyEvm,
  generateEncryptedKeyPairEvm,
} from '@/lib/sonic/evm-wallet-generator';
import { fetchUserPosition } from '@/lib/sonic/fetchUserPositions';
import { getDepositedBalanceWs } from '@/lib/sonic/ftechDepositedAmount';
import { repayWS } from '@/lib/sonic/repay';
import { testPublicClient } from '@/lib/sonic/sonicClient';
import { withdrawSTS } from '@/lib/sonic/withdraw';
import { getPoolMarkets } from '@/server/actions/getMarkets';
import { getPoolTokens } from '@/server/actions/getTokens';
import { getUserPositions } from '@/server/actions/getUserPositions';
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
    marketName: 'S-ETH',
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
      const tokens = await getPoolMarkets(props2);
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
    </div>
  );
}
