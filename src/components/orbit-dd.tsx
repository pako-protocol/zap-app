'use client';

import React from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';

import { skillsOrbit1 } from '@/lib/constants';

export default function OrbitTester() {
  const orbitDuration = 30;
  return (
    <motion.div
      className="absolute h-[300px] w-[300px] rounded-full"
      style={{ border: '2px dashed rgba(255, 255, 255, 0.5)' }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,

        duration: orbitDuration, // Define duration for full rotation

        ease: 'linear',
      }}
    >
      {skillsOrbit1.map((skill, i) => (
        <motion.div
          key={skill.name}
          className="absolute h-12 w-12 rounded-full"
          style={{
            top: '50%',

            left: '50%',

            transform: `rotate(${(i / skillsOrbit1.length) * 360}deg) translate(-50%, -50%) translateX(150px)`,

            transformOrigin: '0 0',
          }}
        >
          <Image
            src={skill.image}
            alt={skill.name}
            className="h-full w-full rounded-full object-contain"
            width={225}
            height={225}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
