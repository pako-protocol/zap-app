import { NextRequest, NextResponse } from 'next/server';

import { getUserData, verifyUser } from '@/server/actions/user';

export async function GET(req: NextRequest) {
  const session = await verifyUser();
  const userId = session?.data?.data?.id;
  const publicKey = session?.data?.data?.publicKey;

  try {
    const data = await getUserData();

    if (!data) {
      return new NextResponse(JSON.stringify({ error: 'No tokens found' }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error(
      `[chat/[user data info]/route] Error fetching user data info: ${error}`,
    );
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
      },
    );
  }
}
