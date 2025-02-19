import React from 'react';

import { PositionSchema } from '@/server/actions/getUserPositions';

export default function PositionCard({
  position,
}: {
  position: PositionSchema | undefined;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-muted/50 p-4">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-medium">Health factor</h3>
            <span className="shrink-0 rounded-md bg-background/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {position?.healthFactor}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-medium">Borrow Power</h3>
            <span className="shrink-0 rounded-md bg-background/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {position?.borrowPowerUsed}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4">
            <div>
              <div className=" flex items-center gap-3 text-sm text-muted-foreground">
                <h3 className="truncate text-base font-medium">Base silo</h3>
                <span className="font-mono">
                  {position?.silo0.siloAddress.slice(0, 4)}...
                  {position?.silo0.siloAddress.slice(-4)}
                </span>
              </div>

              <div className=" flex items-center gap-3 text-sm text-muted-foreground">
                <h3 className="truncate text-base font-medium">
                  Debit balance
                </h3>
                <span className="shrink-0 rounded-md bg-background/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {position?.silo0.debtBalance}
                </span>
              </div>
            </div>
            <div>
              <div className=" flex items-center gap-3 text-sm text-muted-foreground">
                <h3 className="truncate text-base font-medium">Bridge silo</h3>
                <span className="font-mono">
                  {position?.silo1.siloAddress.slice(0, 4)}...
                  {position?.silo1.siloAddress.slice(-4)}
                </span>
              </div>

              <div className=" flex items-center gap-3 text-sm text-muted-foreground">
                <h3 className="truncate text-base font-medium">
                  Debit balance
                </h3>
                <span className="shrink-0 rounded-md bg-background/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {position?.silo1.debtBalance}
                </span>
              </div>
            </div>
          </div>

          {/* Colleteral balance */}
          <div className="mt-3 flex items-center gap-4">
            <div>
              <div className=" flex items-center gap-3 text-sm text-muted-foreground">
                <h3 className="truncate text-base font-medium">Base silo</h3>
                <span className="font-mono">
                  {position?.silo0.siloAddress.slice(0, 4)}...
                  {position?.silo0.siloAddress.slice(-4)}
                </span>
              </div>

              <div className=" flex items-center gap-3 text-sm text-muted-foreground">
                <h3 className="truncate text-base font-medium">
                  Colleteral balance
                </h3>
                <span className="shrink-0 rounded-md bg-background/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {position?.silo0.collateralBalance}
                </span>
              </div>
            </div>
            <div>
              <div className=" flex items-center gap-3 text-sm text-muted-foreground">
                <h3 className="truncate text-base font-medium">Bridge silo</h3>
                <span className="font-mono">
                  {position?.silo1.siloAddress.slice(0, 4)}...
                  {position?.silo1.siloAddress.slice(-4)}
                </span>
              </div>

              <div className=" flex items-center gap-3 text-sm text-muted-foreground">
                <h3 className="truncate text-base font-medium">
                  Colleteral balance
                </h3>
                <span className="shrink-0 rounded-md bg-background/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {position?.silo1.collateralBalance}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
