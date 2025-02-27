import Image from 'next/image';

import { motion } from 'framer-motion';

export const CenterOrbit = () => {
  return (
    <motion.div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-black shadow-lg">
      <Image
        src="/logo.png"
        alt="Next.js"
        className="rounded-full"
        width={90}
        height={90}
      />
    </motion.div>
  );
};
