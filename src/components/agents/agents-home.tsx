'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useLogin } from '@privy-io/react-auth';
import { BookOpenIcon } from 'lucide-react';

import { Agents } from '@/server/actions/getAgents';

import { Brand } from '../logo';
import { ThemeToggle } from '../theme-toggle';
import AnimatedShinyText from '../ui/animated-shiny-text';
import BlurFade from '../ui/blur-fade';
import { Button } from '../ui/button';

interface AgentsHomeProps {
  agents: Agents[];
}

const navItems = [
  { label: 'Ai agents', href: '/agents', icon: BookOpenIcon },
  { label: 'Examples', href: '/example', icon: BookOpenIcon },
  //{ label: 'Docs', href: 'https://docs.Zap', icon: BookOpenIcon },
];

export const Header = ({ handleLogin }: { handleLogin: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <BlurFade delay={0.1} className="relative z-50">
      <header className="">
        <div className="sticky top-2 mx-auto max-w-3xl px-4 py-4">
          <div className="rounded-xl border border-border/50 bg-muted/70 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="relative">
                <Brand className="scale-95 transition-opacity hover:opacity-80" />
              </div>

              <nav className="hidden md:ml-auto md:mr-8 md:flex">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group relative flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Icon className="hidden h-4 w-4" />
                      {item.label}
                      <span className="absolute inset-x-4 -bottom-px h-px scale-x-0 bg-gradient-to-r from-primary/0 via-primary/70 to-primary/0 transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                  );
                })}
                <a
                  href={'https://zenvid.gitbook.io/zap'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Docs
                  <span className="absolute inset-x-4 -bottom-px h-px scale-x-0 bg-gradient-to-r from-primary/0 via-primary/70 to-primary/0 transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </nav>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="absolute left-4 right-4 top-full mt-2 rounded-lg border border-border/50 bg-background/95 p-3 shadow-lg backdrop-blur-md md:hidden">
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className=" hidden h-4 w-4" />
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>
    </BlurFade>
  );
};

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
