'use client';

import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useLogin } from '@privy-io/react-auth';

import { Header } from '@/app/page';
import { Agents } from '@/server/actions/getAgents';

import { ThemeToggle } from '../theme-toggle';
import AnimatedShinyText from '../ui/animated-shiny-text';

const agents = [
  {
    logo: '/integrations/silo_finance.svg',
    name: 'silo Finance',
    description: 'The protocol description will be here',
    features: ['deposit', 'repay', 'withdraw'],
  },
  {
    logo: 'https://cdn.sanity.io/images/nat2546z/production/9c8aebf1be6d6f1aaca8c1de7c1cf3af7b222bdf-607x607.png',
    name: 'Shadow x',
    description: 'The protocol description will be here',
    features: ['deposit', 'repay', 'withdraw'],
  },

  {
    logo: '/integrations/swapx.svg',
    name: 'swapX',
    description: 'The protocol description will be here',
    features: ['deposit', 'repay', 'withdraw'],
  },

  {
    logo: '/integrations/dexscreener.svg',
    name: 'dex screener',
    description: 'The protocol description will be here',
    features: ['deposit', 'repay', 'withdraw'],
  },

  {
    logo: '/integrations/de-bridge.svg',
    name: 'De bridge',
    description: 'The protocol description will be here',
    features: ['deposit', 'repay', 'withdraw'],
  },

  {
    logo: '/integrations/ring-protocol.svg',
    name: 'silo Finance',
    description: 'The protocol description will be here',
    features: ['deposit', 'repay', 'withdraw'],
  },
];

interface AgentsHomeProps {
  agents: Agents[];
}
const AgentsList = ({ agents }: AgentsHomeProps) => {
  return (
    <div className="mx-auto mt-3 max-w-7xl ">
      <div className=" border-b py-7">
        <h1 className="mt-6 text-lg font-semibold tracking-tight md:text-xl lg:text-2xl">
          Explore{' '}
          <AnimatedShinyText className="inline">
            <span> AvailableAgents ⚡</span>
          </AnimatedShinyText>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Automate, analyze, and execute with AI-driven DeFi tools
        </p>
      </div>
      <div className=" mt-8 grid grid-cols-4  gap-4">
        {agents.map((item, i) => (
          <div
            key={i}
            className="flex h-[100px] w-[300px] cursor-pointer items-center space-x-3  rounded-xl border p-3 hover:border-green-500/60"
          >
            <div className="">
              <Image
                src={item.logo}
                width={30}
                height={30}
                alt="Logo"
                className="h-9 w-9 rounded-full"
              />
            </div>
            <div>
              <h1 className="font-semibold capitalize">{item.name}</h1>
              <p className=" text-ellipsis text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default function AgentsHome({ agents }: AgentsHomeProps) {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: async (
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      loginAccount,
    ) => {
      router.push('/home');
    },
  });
  return (
    <div>
      <Header handleLogin={login} />
      <AgentsList agents={agents} />
    </div>
  );
}
