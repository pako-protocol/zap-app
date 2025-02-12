import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sonic } from 'viem/chains';

const pvKey =
  '1624cd89f781ea21740f8a1243b8abea42f6b19e9a873d277ec579e3bcb18a20';
export const account = privateKeyToAccount(`0x${pvKey}`);

export const testWalletClient = createWalletClient({
  account,
  chain: sonic,
  transport: http(),
});

export const testPublicClient = createPublicClient({
  chain: sonic,
  transport: http(),
});
