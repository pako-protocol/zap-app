import React from 'react';

import { MarketPools } from '@/server/actions/getMarketPools';

export default function PoolCard({ market }: { market: MarketPools }) {
  console.log("I'm pool card here", market);
  return (
    <div>
      <h2>Pool card is located here</h2>
    </div>
  );
}
