import React from 'react';

import Image from 'next/image';

import { Placeholder } from '@/lib/placeholder';
import { MarketSchema } from '@/server/actions/getMarkets';

export default function MraketCard({
  market,
}: {
  market: MarketSchema | undefined;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-muted/50 p-4">
      <div className="flex  items-center gap-3">
        <div className=" flex">
          <div className=" relative  h-10 w-10 shrink-0 overflow-hidden rounded-xl  ">
            <Image
              src={
                market?.baseSilo.token.logo ||
                Placeholder.generate({ width: 40, height: 40, text: 'Token' })
              }
              alt={market?.name || 'alt text'}
              className=" rounded-full object-cover  "
              fill
              sizes="40px"
              onError={(e) => {
                (e.target as HTMLImageElement).src = Placeholder.generate({
                  width: 40,
                  height: 40,
                  text: market?.platform.name,
                });
              }}
            />
          </div>
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
            <Image
              src={
                market?.bridgeSilo.token.logo ||
                Placeholder.generate({ width: 40, height: 40, text: 'Token' })
              }
              alt={market?.name || 'alt text'}
              className="object-cover"
              fill
              sizes="40px"
              onError={(e) => {
                (e.target as HTMLImageElement).src = Placeholder.generate({
                  width: 40,
                  height: 40,
                  text: market?.platform.name,
                });
              }}
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-medium">{market?.name}</h3>
            <span className="shrink-0 rounded-md bg-background/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {market?.platform.name}
            </span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            <span className="font-mono">
              {market?.baseSilo.token.tokenAddress.slice(0, 4)}...
              {market?.baseSilo.token.tokenAddress.slice(-4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
