import { NextRequest, NextResponse } from 'next/server';

import { handleAPRupdates } from '@/lib/utils/sonic/silo/fetchOnchainData';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  /* if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }*/

  //await handleAPRupdates();

  try {
    await handleAPRupdates();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
