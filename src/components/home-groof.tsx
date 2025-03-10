import React from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';

import OrbitTester from './orbit-dd';

export default function HomeShow() {
  return (
    <motion.div className="relative flex h-24 w-24 items-center justify-center rounded-full">
      <Image
        src="/logo.png"
        alt="Zap"
        className="rounded-full"
        width={90}
        height={90}
      />
      <OrbitTester />
    </motion.div>
  );
}
