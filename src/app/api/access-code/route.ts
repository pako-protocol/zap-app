import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Access code is required' },
        { status: 400 },
      );
    }

    // Fetch the access code from the database
    const accessCode = await prisma.accessCode.findUnique({
      where: { code },
    });

    // Check if the code exists, is valid, and has not expired
    const isValid =
      accessCode &&
      accessCode.isValid &&
      new Date(accessCode.expireAt) > new Date();

    return NextResponse.json({ valid: !!isValid }, { status: 200 });
  } catch (error) {
    console.error('Error validating access code:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
