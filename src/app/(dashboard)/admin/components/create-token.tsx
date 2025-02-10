'use client';

import React, { ChangeEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';

type TokenFormState = {
  name: string;
  logo: string;
  symbol: string;
  tokenAddress: string;
};

type PlatformState = {
  name: string;
  tvl: number;
};

type SiloState = {
  name: string;
  sonicPoint: number;
  siloAddress: string;
  ltv: number;
  liquidationThreshold: number;
  tvl: number;
  //market          Market   @relation(fields: [marketId], references: [id], onDelete: Cascade)
  marketId: string;
  tokenId: string;
  //token           Token    @relation(fields: [tokenId], references: [id])
  aprBorrow: number;
  aprDeposit: number;
  protocolFee: number;
  utilization: number;
  liquidationFee: number;
  riskLevel: string;
  availableToBorrow: number;
};

type MarketState = {
  name: string;
  marketId: number;
  baseAsset: string;
  bridgeAsset: string;
  tvl: number;
  volume: number;
  protocolFee: number;
  //silos        Silo[]
  // platform     Platform @relation(fields: [platformId], references: [id])
  platformId: string;
};

export default function CreateToken() {
  const [token, setToken] = useState<TokenFormState>({
    name: '',
    logo: '',
    symbol: '',
    tokenAddress: '',
  });

  const [platform, setPlatform] = useState<PlatformState>({
    name: '',
    tvl: 0,
  });

  const [silo, setSilo] = useState<SiloState>({
    name: '',
    sonicPoint: 0,
    siloAddress: '',
    ltv: 0,
    liquidationFee: 0,
    liquidationThreshold: 0,
    tvl: 0,
    marketId: '',
    aprBorrow: 0,
    aprDeposit: 0,
    tokenId: '',
    protocolFee: 0,
    utilization: 0,
    riskLevel: 'LOW',
    availableToBorrow: 0,
  });

  const [market, setMarket] = useState<MarketState>({
    name: '',
    marketId: 0,
    baseAsset: '',
    bridgeAsset: '',
    tvl: 0,
    volume: 0,
    protocolFee: 0,
    platformId: '',
  });

  // Generic change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setToken((prevState) => ({
      ...prevState,
      [name]: value, // Update only the changed field
    }));
  };

  // Generic change handler
  const handlePlatformChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlatform((prevState) => ({
      ...prevState,
      [name]: value, // Update only the changed field
    }));
  };

  // Generic change handler
  const handleSiloChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSilo((prevState) => ({
      ...prevState,
      [name]: value, // Update only the changed field
    }));
  };

  // Generic change handler
  const handleMarketChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSilo((prevState) => ({
      ...prevState,
      [name]: value, // Update only the changed field
    }));
  };

  //  create token func

  const addNewTokens = async () => {
    try {
      console.log("I'm hooked");
      const res = await prisma.token.create({
        data: {
          name: token.name,
          logo: token.logo,
          symbol: token.symbol,
          tokenAddress: token.tokenAddress,
        },
      });

      console.log('response', res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mx-auto max-w-7xl">
      <h1>create token page</h1>
      <div>
        <input
          value={token?.name}
          name="name"
          onChange={handleChange}
          placeholder="Token name"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={token?.symbol}
          name="symbol"
          onChange={handleChange}
          placeholder="Token symbol"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={token?.logo}
          name="logo"
          onChange={handleChange}
          placeholder="Token logo"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={token?.tokenAddress}
          name="tokenAddress"
          onChange={handleChange}
          placeholder="Token address"
          className="my-3 w-full rounded-xl px-3 py-3"
        />

        <Button size={'lg'} className="w-full">
          Create token
        </Button>
      </div>
      {/*Creste market          */}
      <div className="my-7">
        <h1>Create platform</h1>
        <input
          value={platform.name}
          name="name"
          onChange={handlePlatformChange}
          placeholder="Platform name"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={platform.tvl}
          name="tvl"
          onChange={handlePlatformChange}
          placeholder="Platform tvl"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <Button size={'lg'} className="w-full" onClick={() => addNewTokens()}>
          Create Platform
        </Button>
      </div>

      <div className="my-7">
        <h1>Create silo / vault</h1>
        <input
          value={silo.name}
          name="name"
          onChange={handleSiloChange}
          placeholder="Silo name"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={silo.sonicPoint}
          name="sonicPoint"
          onChange={handleSiloChange}
          placeholder="Sonic points"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={silo.siloAddress}
          name="siloAddress"
          onChange={handleSiloChange}
          placeholder="Sonic address"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={silo.ltv}
          name="ltv"
          onChange={handleSiloChange}
          placeholder="Silo ltv"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={silo.liquidationFee}
          name="liquidationFee"
          onChange={handleSiloChange}
          placeholder="Liquidation fee"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={silo.liquidationThreshold}
          name="liquidationThreshold"
          onChange={handleSiloChange}
          placeholder="liquidation Threshold"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={silo.tvl}
          name="tvl"
          onChange={handleSiloChange}
          placeholder="tvl"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={silo.marketId}
          name="marketId"
          onChange={handleSiloChange}
          placeholder="marketId"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={silo.aprBorrow}
          name="aprBorrow"
          onChange={handleSiloChange}
          placeholder="Apr borrow"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={silo.aprDeposit}
          name="aprDeposit"
          onChange={handleSiloChange}
          placeholder="apr deposit"
          className="my-3 w-full rounded-xl px-3 py-3"
        />

        <input
          value={silo.tokenId}
          name="tokenId"
          onChange={handleSiloChange}
          placeholder="Protocol fee"
          className="my-3 w-full rounded-xl px-3 py-3"
        />

        <input
          value={silo.utilization}
          name="utilization"
          onChange={handleSiloChange}
          placeholder="utilization"
          className="my-3 w-full rounded-xl px-3 py-3"
        />

        <Button size={'lg'} className="w-full">
          Create Silo
        </Button>
      </div>

      <div className="my-7">
        <h1>Create market</h1>
        <input
          value={market.name}
          name="name"
          onChange={handleMarketChange}
          placeholder="Market name"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={market.marketId}
          name="marketId"
          onChange={handleMarketChange}
          placeholder="Market id"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={market.baseAsset}
          name="baseAsset"
          onChange={handleMarketChange}
          placeholder="Base asset"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={market.bridgeAsset}
          name="bridgeAsset"
          onChange={handleMarketChange}
          placeholder="Bridge asset"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <input
          value={market.platformId}
          name="platformId"
          onChange={handleMarketChange}
          placeholder="Platfoem id"
          className="my-3 w-full rounded-xl px-3 py-3"
        />
        <Button size={'lg'} className="w-full">
          Create Market
        </Button>
      </div>
    </div>
  );
}
