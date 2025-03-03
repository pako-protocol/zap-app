import { z } from 'zod';

interface TokenINFO {
  name: string;
  symbol: string;
  logo: string;
  tokenAddress: string;
  id: string;
}
export interface Token {
  id: string;
  tokenId: string;
  token: TokenINFO;
}

const tokenShema = z.object({
  name: z.string(),
  id: z.string(),
  symbol: z.string(),
  tokenAddress: z.string(),
  logo: z.string(),
});

const whitelistedTokensSchema = z.object({
  id: z.string(),
  tokenId: z.string(),
  token: tokenShema,
});
const marketsSchema = z.object({
  data: z.object({
    items: z.array(whitelistedTokensSchema),
  }),
});

export const getHyperSonicTokens = async (): Promise<Token[]> => {
  try {
    const response = await fetch(`http://localhost:3000/api/hypersonic`, {
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
      // cache: 'no-store',
    });

    const data = await response.json();
    //const parsed = birdeyeTradersSchema.parse(data);
    console.log('data', data);
    let parsed; // Declare parsed outside the try-catch block
    console.log('parsed data', parsed);
    try {
      // Attempt to parse the data
      parsed = marketsSchema.parse(data); // This will be accessible outside the try block
    } catch (error) {
      // Handle validation errors specifically
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
      } else {
        // Handle other errors (network, fetch, etc.)
        console.error('Error fetching pool markets:', error);
      }
      return []; // Return an empty array or handle the error case appropriately
    }

    // Only return the fields we need
    return await Promise.all(
      parsed.data.items.map(async (token) => ({
        id: token.id,
        token: token.token,
        tokenId: token.tokenId,
        name: token.token.name,
        symbol: token.token.symbol,
        address: token.token.tokenAddress,
        logo: token.token.logo,
      })),
    );
  } catch (error) {
    console.error('Error fetching whitelisted tokens:', error);
    return [];
  }
};
