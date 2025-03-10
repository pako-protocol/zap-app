import { NextRequest, NextResponse } from 'next/server';

import { verifyUser } from '@/server/actions/user';
import {
  dbGetConversation,
  dbGetConversationMessages,
  dbGetHypersonicTokens,
} from '@/server/db/queries';

export async function GET(req: NextRequest) {
  const session = await verifyUser();
  const userId = session?.data?.data?.id;
  const publicKey = session?.data?.data?.publicKey;

  /*if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }*/

  /*if (!publicKey) {
    console.error('[chat/route] No public key found');
    return NextResponse.json({ error: 'No public key found' }, { status: 400 });
  }*/

  try {
    const items = await dbGetHypersonicTokens();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No tokens found found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: { items } });
  } catch (error) {
    console.error(
      `[chat/[conversationId]/route] Error fetching conversation: ${error}`,
    );
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
