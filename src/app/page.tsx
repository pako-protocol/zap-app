'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useLogin } from '@privy-io/react-auth';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { RiTwitterXFill } from '@remixicon/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ActivityIcon,
  BookOpenIcon,
  BrainCircuitIcon,
  LinkIcon,
  ShieldIcon,
  ZapIcon,
} from 'lucide-react';

import { Header } from '@/components/agents/agents-home';
import { CenterOrbit } from '@/components/hero/center-orbit';
import Orbit from '@/components/hero/orbit';
import { OrbitItems } from '@/components/hero/orbit-items';
import { Brand } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { AiParticlesBackground } from '@/components/ui/ai-particles-background';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import BlurFade from '@/components/ui/blur-fade';
import { BorderBeam } from '@/components/ui/border-beam';
import { Button } from '@/components/ui/button';
import { IntegrationsBackground } from '@/components/ui/integrations-background';
import Marquee from '@/components/ui/marquee';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { orbitDurations, skillsOrbit1 } from '@/lib/constants';
import { cn } from '@/lib/utils';

import { IntegrationCardStyles } from './(user)/home/components/integration-card';
import { INTEGRATIONS } from './(user)/home/data/integrations';

const Hero = ({ handleLogin }: { handleLogin: () => void }) => {
  const productRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: productRef,
    offset: ['start end', 'end start'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [30, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 1]);

  return (
    <section className="relative pt-[5.75rem]" ref={productRef}>
      {/* Content */}
      <div className="relative  mx-auto hidden max-w-screen-xl px-6 pb-6 pt-12 text-center md:pb-8 md:pt-16">
        <div className="mx-auto max-w-3xl">
          <BlurFade delay={0.4}>
            <div className="mt-8">
              <RainbowButton
                onClick={handleLogin}
                className="h-12 min-w-[180px] text-base transition-all duration-300 hover:scale-105"
              >
                Getting Started
              </RainbowButton>
            </div>
          </BlurFade>
        </div>
      </div>

      {/* Product Preview */}
      <div className="relative w-full">
        <BlurFade delay={0.6} className="mx-auto hidden max-w-screen-2xl px-6">
          <div className="relative">
            {/* Product images */}
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{
                rotateX,
                scale,
                opacity,
                transformPerspective: 1000,
              }}
              transition={{
                type: 'spring',
                stiffness: 50,
                damping: 20,
                delay: 0.5,
              }}
              className="relative mx-auto w-full max-w-[1200px] will-change-transform"
            >
              <div className="group relative overflow-hidden rounded-2xl border bg-card shadow-2xl">
                {/* Light mode image */}
                <div className="relative dark:hidden">
                  <Image
                    src="/product.png"
                    alt="Neur AI Interface"
                    width={1200}
                    height={675}
                    className="w-full rounded-2xl"
                    priority
                  />
                </div>
                {/* Dark mode image */}
                <div className="relative hidden dark:block">
                  <Image
                    src="/product_dark.png"
                    alt="Neur AI Interface"
                    width={1200}
                    height={675}
                    className="w-full rounded-2xl"
                    priority
                  />
                </div>
                <BorderBeam
                  className="opacity-0 group-hover:opacity-100"
                  duration={10}
                  size={300}
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -left-4 -top-4 h-72 w-72 animate-blob rounded-full bg-primary/5 mix-blend-multiply blur-xl" />
              <div className="animation-delay-2000 absolute -right-4 -top-4 h-72 w-72 animate-blob rounded-full bg-secondary/5 mix-blend-multiply blur-xl" />
            </motion.div>
          </div>
        </BlurFade>
      </div>
      {/* Orbit VIEW */}
      <div className="relative z-10 flex h-[80vh] w-full items-center justify-center overflow-hidden bg-[url('https://framerusercontent.com/images/J9PD0z8SzMHT2KxXQClbD5Q7PU.png')] text-white">
        <CenterOrbit />

        {/* Orbit 1 */}
        <Orbit
          width={300}
          height={300}
          duration={orbitDurations.orbit1}
          reverse={true}
          classname="orbit-1"
        >
          <OrbitItems items={skillsOrbit1} orbitClass="orbit-1" />
        </Orbit>

        {/* Orbit 2 - Rotates in opposite direction */}
        <Orbit
          width={500}
          height={500}
          duration={orbitDurations.orbit2}
          classname="orbit-2"
        >
          <OrbitItems items={skillsOrbit1} orbitClass="orbit-2" />
        </Orbit>

        {/* Orbit 3 - Slowest rotation */}
        <Orbit
          width={1000}
          height={1000}
          duration={orbitDurations.orbit3}
          classname="orbit-3"
        />

        <div className="absolute top-[0%] z-20 flex h-full w-full flex-col dark:bg-black/20 ">
          {/* Content */}
          <div className="relative  mx-auto max-w-screen-xl  px-6 pb-6 pt-12 text-center md:pb-8 md:pt-16">
            <div className="mx-auto max-w-3xl">
              <BlurFade delay={0.3} className="pointer-events-none select-none">
                <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  Your{' '}
                  <AnimatedShinyText className="inline">
                    <span>Smartest DeFi Copilot—</span>
                  </AnimatedShinyText>{' '}
                  Built for <span> Sonic⚡</span>
                </h1>

                <p className="mt-4 text-lg text-muted-foreground">
                  Your AI Copilot for Sonic—Trade, Earn & Automate Like a Pro.
                </p>
              </BlurFade>

              <BlurFade delay={0.4}>
                <div className="mt-8">
                  <RainbowButton
                    onClick={handleLogin}
                    className="h-12 min-w-[180px] text-base transition-all duration-300 hover:scale-105"
                  >
                    Getting Started
                  </RainbowButton>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>

        <div className="absolute top-0 z-0  h-[90vh] w-[85%] rounded-full bg-gradient-to-br from-purple-800/40 via-blue-900/20 to-green-800/60  shadow-2xl shadow-black blur-xl  dark:from-gray-800/40  dark:via-gray-900/20 dark:to-green-800/20 dark:shadow-black"></div>
      </div>
    </section>
  );
};

const features = [
  {
    Icon: BrainCircuitIcon,
    name: 'Cutting-Edge AI Intelligence',
    description:
      "Harness the power of the world's most advanced AI models, including Claude 3.5-Sonnet and GPT-4o, to intelligently analyze your Solana transactions in real-time, providing data-driven insights and seamless automated actions.",
    className: 'col-span-1 sm:col-span-3 lg:col-span-2',
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="relative h-full w-full">
          <div className="absolute left-10 top-10 h-32 w-32 animate-blob rounded-full bg-primary/30 mix-blend-multiply blur-xl"></div>
          <div className="animation-delay-2000 absolute right-10 top-10 h-32 w-32 animate-blob rounded-full bg-secondary/30 mix-blend-multiply blur-xl"></div>
          <div className="animation-delay-4000 absolute bottom-10 left-20 h-32 w-32 animate-blob rounded-full bg-accent/30 mix-blend-multiply blur-xl"></div>
        </div>
      </div>
    ),
  },
  {
    Icon: ZapIcon,
    name: 'Seamless Execution',
    description:
      'Experience ultra-efficient, frictionless transactions powered by our deep Solana integration. Enjoy smooth, rapid execution without the need for compromise.',
    className: 'col-span-1 sm:col-span-3 lg:col-span-1',
    background: (
      <Marquee
        pauseOnHover
        className="absolute inset-0 [--duration:15s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]"
      >
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="mx-2 flex items-center gap-2 rounded-xl border border-primary/20 bg-muted/30 px-3 py-2"
          >
            <div className="text-sm font-medium">
              {idx % 2 === 0 ? 'Instant, frictionless' : 'Seamless transaction'}
            </div>
          </div>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: LinkIcon,
    name: 'Comprehensive Ecosystem Integration',
    description:
      "Effortlessly connect with the full spectrum of Solana's protocols and services. Our platform is designed for seamless AI-powered collaboration, ensuring full synergy with the ecosystem.",
    className: 'col-span-1 sm:col-span-3 lg:col-span-3',
    background: <IntegrationsBackground />,
  },
  {
    Icon: GitHubLogoIcon,
    name: 'Open Source & Community Driven',
    description:
      'Built with transparency and collaboration in mind. Our full-stack application is completely open source, community-driven, and welcomes contributions from developers worldwide to shape the future of Solana AI tools.',
    className: 'col-span-1 sm:col-span-3 lg:col-span-1',
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="h-32 w-32 animate-pulse rounded-full border-4 border-accent"></div>
      </div>
    ),
  },
  {
    Icon: ActivityIcon,
    name: 'AI-Driven Automations & Agents',
    description:
      'Revolutionize your workflows with powerful AI agents and custom automations designed to handle complex tasks. *Coming soon* to streamline your operations even further.',
    className: 'col-span-1 sm:col-span-3 lg:col-span-2',
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="h-32 w-32 animate-pulse rounded-full border-4 border-accent"></div>
      </div>
    ),
  },
];

const Integrations = () => {
  return (
    <BlurFade delay={0.5} className="relative py-16 sm:py-24">
      <div className=" mx-auto max-w-5xl">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:mb-4 sm:text-4xl">
            Built for Sonic⚡
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Integrated with major protocols people love and trust.
          </p>
        </div>
        <Marquee pauseOnHover className="">
          {INTEGRATIONS.map((item, idx) => (
            <div
              key={idx}
              className="mx-2 flex items-center gap-2 rounded-xl border border-primary/20 bg-muted/30 px-3 py-2"
            >
              <div
                className={`flex h-[100px] w-[300px] items-center justify-center space-x-3 `}
                style={
                  {
                    '--integration-primary': item.theme.primary,
                    '--integration-secondary': item.theme.secondary,
                  } as IntegrationCardStyles
                }
              >
                <Image
                  src={item.icon}
                  alt="logo"
                  width={100}
                  height={100}
                  className="h-11 w-11 rounded-full"
                />
                <p>{item.label}</p>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </BlurFade>
  );
};

const Footer = () => {
  return (
    <footer className="mt-auto py-4">
      <BlurFade
        delay={0.5}
        className="flex items-center justify-center gap-3 text-sm text-muted-foreground"
      >
        <p>© 2025 Zap. All rights reserved.</p>
      </BlurFade>
    </footer>
  );
};

export default function Home() {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const router = useRouter();
  let { login } = useLogin({
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

  if (isMaintenanceMode) {
    login = () => {
      window.location.href = 'https://zenvid.gitbook.io/zap';
    };
  }

  return (
    <div className="flex flex-col">
      <Header handleLogin={login} />
      <main className="flex-1">
        <Hero handleLogin={login} />
        <Integrations />
      </main>
      <Footer />
    </div>
  );
}
