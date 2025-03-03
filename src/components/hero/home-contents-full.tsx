'use client';

import React from 'react';

import { CenterOrbit } from '@/components/hero/center-orbit';
import HomeNavbar from '@/components/hero/home-navbar';
import Orbit from '@/components/hero/orbit';
import { OrbitItems } from '@/components/hero/orbit-items';
import HomeShow from '@/components/home-groof';
import { OrbitingCirclesDemo } from '@/components/landing-demo';
import OrbitTester from '@/components/orbit-dd';
import {
  orbitDurations,
  skillsOrbit1,
  skillsOrbit2,
  skillsOrbit3,
} from '@/lib/constants';

///]
export default function page() {
  return (
    <div>
      <HomeNavbar />
      <div className="relative flex h-screen w-full items-center justify-center bg-[url('https://framerusercontent.com/images/J9PD0z8SzMHT2KxXQClbD5Q7PU.png')] text-white">
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

        <div className="absolute top-[0%] z-20 flex h-full w-full flex-col items-center  justify-center">
          <div className=" flex hidden h-[300px] w-[600px] flex-col items-center justify-center rounded-xl border">
            <h1 className="text-center text-5xl font-bold">
              The Next Ai Aent <br /> Agent economy
            </h1>
          </div>
        </div>

        <div className="absolute top-0 z-0 h-[90vh] w-[85%] rounded-full bg-gradient-to-tl from-green-500/5  to-green-500/5"></div>
      </div>
    </div>
  );
}
