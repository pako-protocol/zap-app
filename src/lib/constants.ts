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
