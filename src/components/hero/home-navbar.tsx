import React from 'react';

import Image from 'next/image';

import { Button } from '../ui/button';

export default function HomeNavbar() {
  return (
    <div className="sticky top-3 z-30 flex h-[60px] w-full items-center justify-center bg-inherit ">
      <div className="min mx-auto flex h-full w-full max-w-4xl items-center justify-between rounded-xl border bg-black p-2">
        <div>
          <Image
            src={'/zap.png'}
            width={40}
            height={40}
            alt="logo"
            className="rounded-full"
          />
        </div>

        <Button>Login</Button>
      </div>
    </div>
  );
}
