import { z } from 'zod';

import { dbGetExamples } from '../db/queries';

export interface Examples {
  name: string;
  id: string;
  link: string;
  thumbnail: string;
  createdAt: Date;
}

const exampleSchema = z.object({
  name: z.string(),
  id: z.string(),
  link: z.string(),
  thumbnail: z.string(),
  createdAt: z.date(),
});

const marketsSchema = z.array(exampleSchema);

export const getExamples = async (): Promise<Examples[]> => {
  try {
    const data = await dbGetExamples();
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
        link: example.link,
        thumbnail: example.thumbnail,
        createdAt: example.createdAt,
      })),
    );
  } catch (error) {
    console.error('Error fetching whitelisted tokens:', error);
    return [];
  }
};
