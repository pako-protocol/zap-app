import React from 'react';

import { MarketPools } from '@/server/actions/getMarketPools';

export default function PoolCard({ market }: { market: MarketPools }) {
  console.log("I'm pool card here", market);
  return (
    <div>
      <h2>Pool card is located here</h2>
      <h1>
        <span className="font-semibold text-red-400">Market name :</span>{' '}
        {market.name}
      </h1>
      <h1>
        <span className="font-semibold text-red-400">Silo0 :</span>{' '}
        {market.silo0.name}
      </h1>
      <h1>
        <span className="font-semibold text-red-400">Silo1 :</span>{' '}
        {market.silo1.name}
      </h1>
    </div>
  );
}
