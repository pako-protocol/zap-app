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
export const BACK_END = `http://localhost:5000/api/v1/`;
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

interface Token {
  address: Address;
  chainBased?: boolean;
}

interface WhitelistedTokens {
  [key: string]: Token;
}

interface TokenConfig {
  [chainId: number]: WhitelistedTokens;
}

export const WITHELISTED_TOKENS = {
  S: { address: '0x0000000000000000000000000000000000000000' },
  wS: { address: '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38' },
  AG: { address: '0x005851f943ee2957B1748957F26319e4f9EdeBC1' },
  Anon: { address: '0x79bbF4508B1391af3A0F4B30bb5FC4aa9ab0E07C' },
  BEETS: { address: '0x2D0E0814E62D80056181F5cd932274405966e4f0' },
  BOO: { address: '0x7A0C53F7eb34C5BC8B01691723669adA9D6CB384' },
  BZ: { address: '0xc48c34fcB7328c443e735F3E7Ac393c703b192aD' },
  BRUSH: { address: '0xE51EE9868C1f0d6cd968A8B8C8376Dc2991BFE44' },
  CONK: { address: '0x63A522f6E7D5B96F7aeBB74d2648545E9e14078D' },
  DERP: { address: '0xe920d1DA9A4D59126dC35996Ea242d60EFca1304' },
  DONKS: { address: '0x0a54364631Ea37813a63edb3bBa1C46f8d8304B2' },
  ECO: { address: '0x7A08Bf5304094CA4C7b4132Ef62b5EDc4a3478B7' },
  EGGS: { address: '0xf26Ff70573ddc8a90Bd7865AF8d7d70B8Ff019bC' },
  EQUAL: { address: '0xddF26B42C1d903De8962d3F79a74a501420d5F19' },
  EURCe: { address: '0xe715cbA7B5cCb33790ceBFF1436809d36cb17E57' },
  F: { address: '0xBe422DD2F451348d5D0979D8ab25B4c6eAAd1eB2' },
  FA: { address: '0x8ad39144B37741573F85aa03D6c3E817A0054161' },
  fBUX: { address: '0xd43b5d6899635e514A00b475eEa04C364979e076' },
  FROQ: { address: '0x131F5AE1CBfEFe8EFbDf93dA23fa4d39F14a817c' },
  FS: { address: '0xBC0d0650412EF353D672c0Bbd12eFFF90591B251' },
  fSONIC: { address: '0x05e31a691405d06708A355C029599c12d5da8b28' },
  GFI: { address: '0xbF5899166AC476370B3117c9256B7fc45624f4eA' },
  GIMP: { address: '0xc7513ccDe2D0E5442D3B00D0F798b9187662d073' },
  GOGLZ: { address: '0x9fDbC3f8Abc05Fa8f3Ad3C17D2F806c1230c4564' },
  GSNAKE: { address: '0x674a430f531847a6f8976A900f8ace765f896a1b' },
  HAWG: { address: '0x1cefa23C160Ba7f11Fd770d51822254238DBa3E5' },
  HEDGY: { address: '0x6fB9897896Fe5D05025Eb43306675727887D0B7c' },
  INDI: { address: '0x4EEC869d847A6d13b0F6D1733C5DEC0d1E741B4f' },
  JOINT: { address: '0xC046dCb16592FBb3F9fA0C629b8D93090dD4cB76' },
  K: { address: '0x7732Cda61C9f7852c8A016B815f07ccD067A918f' },
  LBR: { address: '0xE96159Ca91a183e727a95568134Ca71566386a40' },
  LOVE: { address: '0x66F69F79De1AC9C27FE67B8009C2366617C10174' },
  LUDWIG: { address: '0xe6cc4D855B4fD4A9D02F46B9adae4C5EfB1764B5' },
  MEEP: { address: '0x8885D6684120aaC9520aFbCDBcCd47079032F069' },
  METRO: { address: '0x71E99522EaD5E21CF57F1f542Dc4ad2E841F7321' },
  MGEM: { address: '0x8A3b1cd8d0DEcF649262e56EcE6B339E59f350db' },
  Missor: { address: '0xf26B3Fd147619Df61D4c1D0a9F7200B31A73FAfa' },
  Moist: { address: '0x690d956D97d3EEe18AB68ED1A28a89d531734F3d' },
  MOON: { address: '0x486B6Fa0419b33a0c7A6e4698c231D7E2f2D5299' },
  NAVI: { address: '0x6881B80ea7C858E4aEEf63893e18a8A36f3682f3' },
  ONIC: { address: '0x125E7B3A715d2A8c5a8518301C7E4356ff54b7A0' },
  OS: { address: '0xb1e25689D55734FD3ffFc939c4C3Eb52DFf8A794' },
  PENIS: { address: '0x230E36e8370b7574665443bBDCcF0Ce429632456' },
  PHANIC: { address: '0xB4F58eeAbE36711D72e99f35cbf36210561522bE' },
  PLUS: { address: '0xE53aFA646d48E9EF68fCd559F2a598880a3f1370' },
  RUGGIE: { address: '0xB2a909b8bCce9B30BbC9d4c748fD897d6AD9c285' },
  SACRA: { address: '0x7AD5935EA295c4E743e4f2f5B4CDA951f41223c2' },
  SANIC: { address: '0xc1aC6D480966CED520Eff0e9B081B8Ec30548790' },
  SBEER: { address: '0x93cd403693Da40d27188714a872943F717E3c543' },
  scBTC: { address: '0xBb30e76d9Bb2CC9631F7fC5Eb8e87B5Aff32bFbd' },
  scETH: { address: '0x3bcE5CB273F0F148010BbEa2470e7b5df84C7812' },
  scUSD: { address: '0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE' },
  sDOG: { address: '0x50Bc6e1DfF8039A4b967c1BF507ba5eA13fa18B6' },
  sGF: { address: '0x7228cE0E9972d67F2bbC9d0A89a6514B8B750Dcb' },
  sGOAT: { address: '0x43F9a13675e352154f745d6402E853FECC388aA5' },
  SHADOW: { address: '0x3333b97138D4b086720b5aE8A7844b1345a33333' },
  SHRIMP: { address: '0x873e509A21b106937472834201d653Ba62951c7E' },
  Silo: { address: '0x53f753E4B17F4075D6fa2c6909033d224b81e698' },
  SILVER: { address: '0x3AB6449127Ffb192F711e7D23A7c2f4a5cAd9Dc0' },
  SOLID: { address: '0x777CF5ba9C291A1A8f57FF14836F6F9dC5c0F9Dd' },
  SonicX: { address: '0x495D3A3A954185b876A63B023f13b7f4B0ce35d2' },
  SPEED: { address: '0x9990dE39Ca46151150E392Ca96EB349d0f549166' },
  stS: { address: '0xE5DA20F15420aD15DE0fa650600aFc998bbE3955' },
  SURV: { address: '0xb161Fe49dEB1BDa8e3A4a484D5CcD927a35A7DDe' },
  SWPx: { address: '0xA04BC7140c26fc9BB1F36B1A604C7A5a88fb0E70' },
  TAILS: { address: '0x41211648C51AcB9A5F39A93C657e894A0bdB88e4' },
  THC: { address: '0x17Af1Df44444AB9091622e4Aa66dB5BB34E51aD5' },
  TOONA: { address: '0xf4F9C50455C698834Bb645089DbAa89093b93838' },
  TYSG: { address: '0x56192E94434c4fd3278b4Fa53039293fB00DE3DB' },
  USDCe: { address: '0x29219dd400f2bf60e5a23d13be72b486d4038894' },
  USDT: { address: '0x6047828dc181963ba44974801FF68e538dA5eaF9' },
  VLOOM: { address: '0x263C45E626706e225dcd186Ca6127f7F5fCE0D22' },
  WAGMI: { address: '0x0e0Ce4D450c705F8a0B6Dd9d5123e3df2787D16B' },
  WETH: { address: '0x50c42dEAcD8Fc9773493ED674b675bE577f2634b' },
  wOS: { address: '0x9F0dF7799f6FDAd409300080cfF680f5A23df4b1' },
  WOOF: { address: '0x7F883dA3B0d77978075f7C9c03E1B9F461CA1B8d' },
  x33: { address: '0x3333111A391cC08fa51353E9195526A70b333333' },
  YEL: { address: '0x949185D3BE66775Ea648F4a306740EA9eFF9C567' },
  YOKO: { address: '0x59524D5667B299c0813Ba3c99a11C038a3908fBC' },
};
