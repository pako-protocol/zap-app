'use client';

import React from 'react';

import { CenterOrbit } from '@/components/hero/center-orbit';
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
      <div className="sticky top-0 z-40 h-[60px] w-full bg-yellow-400"></div>
      <div className="relative flex h-screen w-full items-center justify-center">
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
      </div>

      <OrbitingCirclesDemo />
    </div>
  );
}
