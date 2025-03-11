import { Address } from 'viem';

import config from '../../package.json';

export const APP_VERSION = config.version;
export const IS_BETA = true;

export const RPC_URL =
  process.env.NEXT_PUBLIC_HELIUS_RPC_URL ||
  'https://api.mainnet-beta.solana.com';

export const MAX_TOKEN_MESSAGES = 10;

export const NO_CONFIRMATION_MESSAGE = ' (Does not require confirmation)';
export const SILO_LENS_ADDRESS = '0xE05966aee69CeCD677a30f469812Ced650cE3b5E';
export const SONIC_RPC_URL = 'https://rpc.soniclabs.com';

export const WS_ADDRESS = '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38';
export const STS_ADDRESS = '0xE5DA20F15420aD15DE0fa650600aFc998bbE3955';

export const BORROWABLE_WS_DEPOSIT_ADDRESS =
  '0x47d8490Be37ADC7Af053322d6d779153689E13C1';
export const BORROWABLE_STS_DEPOSIT_ADDRESS =
  '0x396922EF30Cf012973343f7174db850c7D265278';
export const ETH_ADDRESS = '0x50c42dEAcD8Fc9773493ED674b675bE577f2634b';
export const ETH_SILO = '0x427514a905fa6bEaed9A36E308Fcfa06cE54e95b';
export const ROUTER_ADDRESS = '0x22AacdEc57b13911dE9f188CF69633cC537BdB76';
export const HYPERSONIC_ROUTER_ADDRESS =
  '0x5045E3E6F8a07690390dE1240C5Bb8ab2184500a';
export const STS_S_MARKET_ID = '3';

export const S_BASE = '0xE223C8e92AA91e966CA31d5C6590fF7167E25801';
export const USDC_BRIDGE = '0x4E216C15697C1392fE59e1014B009505E05810Df';
export const S_USDC_MARKET_ID = '8';
export const BACK_END = `https://yield-server-alpha.vercel.app/api/v1/`;
interface Token {
  address: Address;
  chainBased?: boolean;
}

// testing constants
export const skillsOrbit1 = [
  { name: 'siloFinance', image: '/integrations/silo_finance.svg' },

  { name: 'seapx', image: '/integrations/swap_x.svg' },

  { name: 'ring', image: '/integrations/ring-protocol.svg' },
  {
    name: 'Silver swap',
    image:
      'https://cdn.sanity.io/images/nat2546z/production/e249240f552d89347f4b991083e21164540bc644-129x129.png',
  },
  {
    name: 'shadow',
    image:
      'https://cdn.sanity.io/images/nat2546z/production/9c8aebf1be6d6f1aaca8c1de7c1cf3af7b222bdf-607x607.png',
  },
  {
    name: 'Sonic market',
    image:
      'https://cdn.sanity.io/images/nat2546z/production/4889753c54dd68dd1a7d82b6f955cd622aff0473-65x64.png',
  },
];

export const skillsOrbit2 = [
  { name: 'Debridge', image: '/integrations/de-bridge.svg' },

  { name: 'Prisma', image: '/integrations/de-five.png' },

  { name: 'Framer Motion', image: '/integrations/defillama.svg' },

  { name: 'TailwindCSS', image: '/integrations/defined_fi.svg' },
];

export const skillsOrbit3 = [
  { name: 'Next.js', image: '/integrations/dexscreener.svg' },

  { name: 'ShadCN UI', image: '/integrations/dialect.svg' },

  { name: 'Google Docs', image: '/integrations/jupiter.svg' },
];

export const orbitDurations = {
  orbit1: 30,
  orbit2: 45,
  orbit3: 60,
};
