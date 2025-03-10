import Image from 'next/image';

import { motion } from 'framer-motion';

// Import styles

interface OrbItemProps {
  items: { name: string; image: string }[]; // Array of items
  orbitClass: string; // CSS class for orbit size
}

export const OrbitItems = ({ items, orbitClass }: OrbItemProps) => {
  return (
    <div className={`orbit-items ${orbitClass} z-0`}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="orbit-item "
          style={{ '--index': i / items.length } as React.CSSProperties} // Dynamic spacing
        >
          <Image
            src={item.image}
            alt={item.name}
            className=" h-[80%] w-[80%] rounded-full  object-contain"
            width={40}
            height={40}
          />
        </motion.div>
      ))}
    </div>
  );
};
