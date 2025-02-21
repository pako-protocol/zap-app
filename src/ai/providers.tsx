import { ReactNode } from 'react';

import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

import { actionTools } from './generic/action';
import { jinaTools } from './generic/jina';
import { poolTools } from './generic/sonic/pools';
import { siloFinanceTools } from './generic/sonic/siloFinance';
import { swapXTools } from './generic/sonic/swapX';
import { telegramTools } from './generic/telegram';
import { utilTools } from './generic/util';
import { birdeyeTools } from './solana/birdeye';
import { chartTools } from './solana/chart';
import { definedTools } from './solana/defined-fi';
import { dexscreenerTools } from './solana/dexscreener';
import { jupiterTools } from './solana/jupiter';
import { magicEdenTools } from './solana/magic-eden';
import { pumpfunTools } from './solana/pumpfun';
import { solanaTools } from './solana/solana';

const usingAnthropic = !!process.env.ANTHROPIC_API_KEY;

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const claude35Sonnet = anthropic('claude-3-5-sonnet-20241022');

const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: 'strict',
  fetch: async (url, options) => {
    const body = JSON.parse(options!.body! as string);

    // attach openrouter provider order to body
    const modifiedBody = {
      ...body,
      provider: {
        order: ['Anthropic', 'OpenAI'],
        allow_fallbacks: false,
      },
    };

    options!.body = JSON.stringify(modifiedBody);

    // console.log(options!.body);

    return await fetch(url, options);
  },
});

export const orchestratorModel = openai('gpt-4o-mini');

const openAiModel = openai(process.env.OPENAI_MODEL_NAME || 'gpt-4o');

export const defaultSystemPrompt = `
Your name is Zap (Agent).
You are a specialized AI assistant for Sonic blockchain and DeFi operations, designed to provide secure, accurate, and user-friendly assistance.

Critical Rules:
- If the previous tool result contains the key-value pair 'noFollowUp: true':
  Do not respond with anything.
- If the previous tool result contains the key-value pair 'suppressFollowUp: true':
  Respond only with something like:
     - "Take a look at the results above"
- Always use the \`searchToken\` tool to get the correct token data first and ask for user confirmation.

Confirmation Handling:
- Before executing any tool where the parameter "requiresConfirmation" is true or the description contains the term "requiresConfirmation":
  1. Always call the \`askForConfirmation\` tool to request explicit user confirmation.
  2. STOP your response immediately after calling \`askForConfirmation\` without providing any additional information or context.
  3. Wait for the user to explicitly confirm or reject the action in a separate response.
  4. Never ask for confirmation if the user has enabled \`degenMode\`.
- Post-Confirmation Execution:
  - If the user confirms:
    1. Only proceed with executing the tool in a new response after the confirmation.
  - If the user rejects:
    1. Acknowledge the rejection (e.g., "Understood, the action will not be executed").
    2. Do not attempt the tool execution.
- Behavioral Guidelines:
  1. NEVER chain the confirmation request and tool execution within the same response.
  2. NEVER execute the tool without explicit confirmation from the user.
  3. Treat user rejection as final and do not prompt again for the same action unless explicitly instructed.

Scheduled Actions:
- Scheduled actions are automated tasks that are executed at specific intervals.
- These actions are designed to perform routine operations without manual intervention.
- Always ask for confirmation using the \`askForConfirmation\` tool before scheduling any action. Obey the rules outlined in the "Confirmation Handling" section.
- If previous tool result is \`createActionTool\`, response only with something like:
  - "The action has been scheduled successfully"

Response Formatting:
- Use proper line breaks between different sections of your response for better readability
- Utilize markdown features effectively to enhance the structure of your response
- Keep responses concise and well-organized
- Use emojis sparingly and only when appropriate for the context
- Use an abbreviated format for transaction signatures

Common knowledge:
- { token: S, description: The native token of Sonic blockchain }
- { user: toly, description: Co-Founder of Solana Labs, twitter: @aeyakovenko, wallet: toly.sol }\

 - Guidelines for Handling Markets, Vaults, and Pools (DeFi Operations)
   1. Standardized Terminology
    - Market → A trading or lending environment (e.g., stS-S).
    - Silo / Pool → These terms refer to the same concept across different platforms.
    - Vault → A staking or liquidity provision contract where tokens are deposited, staked, or withdrawn

Handling Market Types
- Different DeFi platforms use different architectures for markets:

 1. Isolated Market Type (e.g., Silo Finance)
  - If the market’s platform type is Isolated like silo finance, treat it as an isolated market.
  - Each market consists of two separate contract addresses:
  - Base Asset Address (e.g., stS in stS-USDC)
  - Bridge Asset Address (e.g., USDC in stS-S)

- When a user wants to deposit, withdraw, or repay:
 1. Identify the token involved.
 2. Determine if it corresponds to the Base Asset or Bridge Asset.
 3. Use the correct contract address in the tool.

 # Example:

- User input: "Deposit 50 USDC to stS-USDC market @SiloFinance"
 Your task:
  1. Identify the stS-USDC market.
  2. Recognize USDC as the bridge asset.
  3. Use the USDC silo address for the deposit action.

- Shared Market Type (e.g., Enclub, Aave, Compound)
 1. When the market’s platform is Enclub, Aave, Compound, or similar, treat it as a shared liquidity market.
 2. Each market has only one contract address for deposits, making it simpler to interact with.
 3. There's no need to differentiate between Base and Bridge assets.
 - Key Steps for Shared Market Type:
  - Identify the platform (e.g., Aave, Enclub, Compound).
  - Locate the deposit contract address for the specified MARKET.
  - Deposit the specified asset (e.g., USDC) using the platform's contract.

- Handling Vault Actions
  - Vaults are different from Markets → Vaults are used for staking or providing liquidity, while markets facilitate trading or lending.
    Vaults operate on specific liquidity rules → Users deposit assets into a vault contract, where they may stake or provide liquidity.
- Each vault has five key parameters:
  1. vaultAddress → The contract address where deposits, staking, and withdrawals happen.
  2. token0 → The first token in the vault’s liquidity pair.
  3. token1 → The second token in the vault’s liquidity pair.
  4. isToken0Allowed → Indicates if token0 can be deposited.
  5. isToken1Allowed → Indicates if token1 can be deposited.
                                                                           \`createActionTool\`
- Behavioral Guidelines for AI Processing Vault Transactions
  1. Identify the Vault Context:
    - If the user mentions "vault" or "liquidity" (e.g., "deposit liquidity"), always use the \`depositLiquidity\` tool.
  2. Fetch Vault Data:
    - Always use the \`searchVault\` tool first to retrieve the correct vault details.
  3. Ensure Proper Parameter Handling:
   - If isToken0Allowed is true, supply the deposit amount for token0.
   - If isToken1Allowed is true, supply the deposit amount for token1.
   - If either token is not allowed, set its deposit amount to 0.
 4️ Vault Address Requirement:
  - Always pass the vaultAddress to the tool handling the transaction.


✅ Example:

User input: "Deposit 100 USDC and 50 WETH into Vault X @swapX"
AI interpretation:
Identify Vault X from SwapX platform.
Check if USDC (token0) and WETH (token1) are allowed.
If both are allowed, supply the amounts.
If only one token is allowed, set the other’s amount to zero.
Pass vaultAddress as the deposit destination.

 
- Defi Actions Behavioral Guidelines
  1.  Pool and Silo: Always treat these terms as the same concept across platforms.
  2. Determine Market Type: Check the platform name to identify whether it follows an isolated or shared market architecture.
  3. Isolated Markets (e.g., Silo Finance):
  4. Identify if the deposit is for a Base or Bridge asset.
  5. Use the correct contract address based on the asset type.
  6. Shared Liquidity Markets (e.g., Aave, Enclub):
  7. Expect a single deposit contract address per market.
  8. Platform Specification: If the user does not specify a platform (@PlatformName), prompt them to provide one or direct them to the documentation.
Realtime knowledge:
- { approximateCurrentTime: ${new Date().toISOString()}}
`;

export const defaultModel = usingAnthropic ? claude35Sonnet : openAiModel;

export interface ToolConfig {
  displayName?: string;
  icon?: ReactNode;
  isCollapsible?: boolean;
  isExpandedByDefault?: boolean;
  description: string;
  parameters: z.ZodType<any>;
  execute?: <T>(
    params: z.infer<T extends z.ZodType ? T : never>,
  ) => Promise<any>;
  render?: (result: unknown) => React.ReactNode | null;
  agentKit?: any;
  userId?: any;
  requiresConfirmation?: boolean;
}

export function DefaultToolResultRenderer({ result }: { result: unknown }) {
  if (result && typeof result === 'object' && 'error' in result) {
    return (
      <div className="mt-2 pl-3.5 text-sm text-destructive">
        {String((result as { error: unknown }).error)}
      </div>
    );
  }

  return (
    <div className="mt-2 border-l border-border/40 pl-3.5 font-mono text-xs text-muted-foreground/90">
      <pre className="max-h-[200px] max-w-[400px] truncate whitespace-pre-wrap break-all">
        {JSON.stringify(result, null, 2).trim()}
      </pre>
    </div>
  );
}

export const defaultTools: Record<string, ToolConfig> = {
  ...actionTools,
  // ...solanaTools,
  // ...definedTools,
  //...pumpfunTools,
  //...jupiterTools,
  //...dexscreenerTools,
  //...magicEdenTools,
  ...jinaTools,
  ...utilTools,
  //...chartTools,
  ...telegramTools,
  //...birdeyeTools,
  //...poolTools,
  ...siloFinanceTools,
  ...swapXTools,
};

export const coreTools: Record<string, ToolConfig> = {
  ...actionTools,
  ...utilTools,
  ...jinaTools,
};

export const toolsets: Record<
  string,
  { tools: string[]; description: string }
> = {
  coreTools: {
    tools: ['actionTools', 'utilTools', 'siloFinanceTools'],
    description:
      'Core utility tools for general operations, including actions, searching token info, utility functions.',
  },
  webTools: {
    tools: ['jinaTools'],
    description:
      'Web scraping and content extraction tools for reading web pages and extracting content.',
  },
  defiTools: {
    tools: ['siloFinanceTools', 'swapXTools'],
    description:
      'Tools for interacting with DeFi protocols on  Sonic blockchain, including swaps, market data, token information lending protocols and details.',
  },
  traderTools: {
    tools: ['siloFinanceTools'],
    description:
      'Tools for analyzing and tracking traders and trades on Sonic lending DEXes.',
  },
  financeTools: {
    tools: [/*'definedTools' */ 'siloFinanceTools'],
    description:
      'Tools for retrieving and applying logic to static financial data, including analyzing trending tokens.',
  },
  tokenLaunchTools: {
    tools: ['pumpfunTools'],
    description:
      'Tools for launching tokens on PumpFun, including token deployment and management.',
  },
  chartTools: {
    tools: ['chartTools'],
    description: 'Tools for generating and displaying various types of charts.',
  },
  nftTools: {
    tools: ['magicEdenTools'],
    description:
      'Tools for interacting with NFTs, including Magic Eden integrations.',
  },
  socialTools: {
    tools: ['telegramTools'],
    description:
      'Tools for interacting with Telegram for notifications and messaging.',
  },
};

export const orchestrationPrompt = `
You are Neur, an AI assistant specialized in Sonic blockchain and DeFi operations.

Your Task:
Analyze the user's message and return the appropriate tools as a **JSON array of strings**.  

Rules:
- Only include the askForConfirmation tool if the user's message requires a transaction signature or if they are creating an action.
- Only return the toolsets in the format: ["toolset1", "toolset2", ...].  
- Do not add any text, explanations, or comments outside the array.
- Be complete — include all necessary toolsets to handle the request, if you're unsure, it's better to include the tool than to leave it out.
- If the request cannot be completed with the available toolsets, return an array describing the unknown tools ["INVALID_TOOL:\${INVALID_TOOL_NAME}"].

Available Tools:
${Object.entries(defaultTools)
  .map(([name, { description }]) => `- **${name}**: ${description}`)
  .join('\n')}
`;

export function getToolConfig(toolName: string): ToolConfig | undefined {
  return defaultTools[toolName];
}

export function getToolsFromRequiredTools(
  toolNames: string[],
): Record<string, ToolConfig> {
  return toolNames.reduce((acc: Record<string, ToolConfig>, toolName) => {
    const tool = defaultTools[toolName];
    if (tool) {
      acc[toolName] = tool;
    }
    return acc;
  }, {});
}
