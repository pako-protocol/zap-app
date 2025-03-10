'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useLogin } from '@privy-io/react-auth';
import { BookOpenIcon } from 'lucide-react';

import { Examples, getExamples } from '@/server/actions/getExamples';
import { dbGetExamples } from '@/server/db/queries';

import { Header } from '../agents/agents-home';
import { Brand } from '../logo';
import { ThemeToggle } from '../theme-toggle';
import AnimatedShinyText from '../ui/animated-shiny-text';
import BlurFade from '../ui/blur-fade';
import { Button } from '../ui/button';
import { HeroVideoDialog } from '../ui/hero-video';

const agents = [
  {
    logo: '/integrations/silo_finance.svg',
    name: 'silo Finance',
    description: 'The protocol description will be here',
    features: ['deposit', 'repay', 'withdraw'],
  },
  {
    logo: '/integrations/silo_finance.svg',
    name: 'silo Finance',
    description: 'The protocol description will be here',
    features: ['deposit', 'repay', 'withdraw'],
  },

  {
    logo: '/integrations/silo_finance.svg',
    name: 'silo Finance',
    description: 'The protocol description will be here',
    features: ['deposit', 'repay', 'withdraw'],
  },

  {
    logo: '/integrations/silo_finance.svg',
    name: 'silo Finance',
    description: 'The protocol description will be here',
    features: ['deposit', 'repay', 'withdraw'],
  },

  {
    logo: '/integrations/silo_finance.svg',
    name: 'silo Finance',
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

interface ExamplesHomeProps {
  examples: Examples[];
}

const ExampleList = ({ examples }: ExamplesHomeProps) => {
  return (
    <div className="mx-auto max-w-7xl  ">
      <div className=" my-7 border-b py-7">
        <h1 className=" text-lg font-semibold tracking-tight md:text-xl lg:text-2xl">
          See{' '}
          <AnimatedShinyText className="inline">
            <span>It in Action 🎬</span>
          </AnimatedShinyText>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Curated short videos (under 1 min) showcasing what’s possible.
        </p>
      </div>
      <div className=" mt-8 grid grid-cols-2  gap-4">
        {examples.map((item, i) => (
          <div className="relative rounded-xl border " key={i}>
            <HeroVideoDialog
              className="block dark:hidden"
              animationStyle="from-center"
              videoSrc={item.link}
              thumbnailSrc={item.thumbnail}
              thumbnailAlt="Hero Video"
            />
            <HeroVideoDialog
              className="hidden dark:block"
              animationStyle="from-center"
              videoSrc={item.link}
              thumbnailSrc={item.thumbnail}
              thumbnailAlt="Hero Video"
            />
            <div className="px-2 py-1">
              <h2>{item.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ExamplesHome({ examples }: ExamplesHomeProps) {
  console.log('Examples from home', examples);
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
      <ExampleList examples={examples} />
      <ThemeToggle />
    </div>
  );
}
