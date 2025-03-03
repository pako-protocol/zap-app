import Image from 'next/image';

import { motion } from 'framer-motion';

//
export const CenterOrbit = () => {
  return (
    <motion.div className="h-54 w-54 relative flex items-center justify-center rounded-full bg-black shadow-lg">
      <Image
        src="/logo.png"
        alt="Next.js"
        className="rounded-full"
        width={190}
        height={190}
      />
    </motion.div>
  );
};
