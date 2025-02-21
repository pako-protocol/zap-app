'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateMarkets() {
  revalidatePath('http://localhost:5000/api/v1/vaults/get-vaults');
}
