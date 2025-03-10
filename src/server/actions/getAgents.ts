import { z } from 'zod';

import { dbGetAgents } from '../db/queries';

export interface Agents {
  name: string;
  id: string;
  logo: string;
  description: string;
  features: string;
}

const exampleSchema = z.object({
  name: z.string(),
  id: z.string(),
  logo: z.string(),
  description: z.string(),
  features: z.string(),
});

const marketsSchema = z.array(exampleSchema);

export const getAgents = async (): Promise<Agents[]> => {
  try {
    const data = await dbGetAgents();
    console.log('data', data);
    let parsed; // Declare parsed outside the try-catch block

    try {
      // Attempt to parse the data
      parsed = marketsSchema.parse(data); // This will be accessible outside the try block
      console.log('parsed data', parsed);
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
      parsed.map(async (example) => ({
        id: example.id,
        name: example.name,
        logo: example.logo,
        description: example.description,
        features: example.features,
      })),
    );
  } catch (error) {
    console.error('Error fetching whitelisted tokens:', error);
    return [];
  }
};
