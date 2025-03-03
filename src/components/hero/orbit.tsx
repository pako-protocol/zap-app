'use client';

import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

interface OrbitInterface {
  width: number;
  height: number;
  children?: React.ReactNode;
  reverse?: boolean;
  duration: number;
  classname: string;
} ///
const Orbit = ({
  width,
  height,
  duration,
  children,
  reverse,
  classname,
}: OrbitInterface) => {
  const [dynamicDuration, setDynamicDuration] = useState(duration);

  /*useEffect(() => {
    const updateDuration = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640)
        setDynamicDuration(duration * 1.5); // Slow down on small screens
      else if (screenWidth < 1024)
        setDynamicDuration(duration * 1.2); // Medium screens
      else setDynamicDuration(duration); // Default for large screens
    };

    updateDuration();
    window.addEventListener('resize', updateDuration);
    return () => window.removeEventListener('resize', updateDuration);
  }, [duration]);*/

  return (
    <motion.div
      className={`absolute rounded-full border border-dashed ${classname} z-10  `}
      style={
        {
          //width: `${width}px`,
          //height: `${height}px`,
        }
      }
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{
        repeat: Infinity,
        duration: dynamicDuration,
        ease: 'linear',
      }}
    >
      {children}
    </motion.div>
  );
};

export default Orbit;
