import Image from 'next/image';

import { motion } from 'framer-motion';

//
export const CenterOrbit = () => {
  return (
    <motion.div className="h-54 w-54 relative flex items-center justify-center rounded-full bg-black shadow-lg">
      <Image
        src="/zap.png"
        alt="Zap logo"
        className="rounded-full"
        width={170}
        height={170}
      />
    </motion.div>
  );
};
