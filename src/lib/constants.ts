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

export const ROUTER_ADDRESS = '0x22AacdEc57b13911dE9f188CF69633cC537BdB76';
export const STS_S_MARKET_ID = '3';

export const S_BASE = '0xE223C8e92AA91e966CA31d5C6590fF7167E25801';
export const USDC_BRIDGE = '0x4E216C15697C1392fE59e1014B009505E05810Df';
export const S_USDC_MARKET_ID = '8';
