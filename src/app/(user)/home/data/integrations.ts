export interface IntegrationTheme {
  primary: string;
  secondary: string;
}

export interface Integration {
  icon: string;
  label: string;
  description?: string;
  theme: IntegrationTheme;
}

export const INTEGRATIONS: Integration[] = [
  {
    icon: 'integrations/silo_finance.svg',
    label: 'Silo finance',
    description: 'Lending protocol that offers risk-isolated markets',
    theme: {
      primary: '#10B981', // Green
      secondary: '#10B981', // Green
    },
  },
  {
    icon: 'integrations/swap_x.svg',
    label: 'SwapX',
    description: 'V4 DEX with concentrated liquidity',
    theme: {
      primary: '#16A34A', // Green
      secondary: '#22C55E', // Light green
    },
  },
  {
    icon: 'integrations/de-bridge.svg',
    label: 'De Bridge',
    description: 'Bridge that moves at lightspeed.',
    theme: {
      primary: '#e6dd3e', // Purple
      secondary: '#a5bf21', // Light purple
    },
  },
  {
    icon: 'integrations/ring-protocol.svg',
    label: 'Ring protocol',
    description: 'Scalable yield-bearing stablecoin',
    theme: {
      primary: '#9e6bbf', // Blue
      secondary: '#38BDF8', // Light blue
    },
  },
  {
    icon: 'integrations/dexscreener.svg',
    label: 'DexScreener',
    description: 'Discover trending tokens',
    theme: {
      primary: '#64748B', // Gray
      secondary: '#94A3B8', // Light gray
    },
  },
  {
    icon: 'integrations/defillama.svg',
    label: 'Defi Lama',
    description: 'Discover unbiassed Defi trends',
    theme: {
      primary: '#B0EECF', // Orange
      secondary: '#181432', // White
    },
  },
];
