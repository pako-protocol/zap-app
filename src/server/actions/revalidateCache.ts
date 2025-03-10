'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateMarkets() {
  revalidatePath('/api/hypersonic');
}
