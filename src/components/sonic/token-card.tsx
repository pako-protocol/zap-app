import React from 'react';

import Image from 'next/image';

import { Placeholder } from '@/lib/placeholder';
import { PoolToken } from '@/server/actions/getTokens';

export default function TokenCard({ token }: { token: PoolToken | undefined }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-muted/50 p-4">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={
              token?.logo ||
              Placeholder.generate({ width: 40, height: 40, text: 'Token' })
            }
            alt={token?.name || 'slt text'}
            className="object-cover"
            fill
            sizes="40px"
            onError={(e) => {
              (e.target as HTMLImageElement).src = Placeholder.generate({
                width: 40,
                height: 40,
                text: token?.symbol,
              });
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-medium">{token?.name}</h3>
            <span className="shrink-0 rounded-md bg-background/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {token?.symbol}
            </span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            <span className="font-mono">
              {token?.tokenAddress.slice(0, 4)}...
              {token?.tokenAddress.slice(-4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
