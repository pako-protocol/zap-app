import Image from 'next/image';

import { motion } from 'framer-motion';

/*interface OrbItemProps {
  items: {
    name: string;
    image: string;
  }[]; // Array of skill objects
  radius: number; // Distance from the center (should be a number)
  logoWidth: number; // Width of the logo (number for Image component)
  logoHeight: number; // Height of the logo (number for Image component)
 
}
export const OrbitItems = ({
  items,
  radius,
  logoHeight,
  logoWidth,
}: OrbItemProps) => {
  return (
    <>
      {items.map((item, i) => (
        <motion.div
          key={item.name}
          className="absolute h-12 w-12 rounded-full"
          style={{
            top: '60%',
            left: '50%',
            transform: `rotate(${(i / items.length) * 360}deg) 
                        translate(-50%, -50%) 
                        translateX(${radius}px)`,
            transformOrigin: '0 0',
          }}
        >
          <Image
            src={item.image}
            alt={item.name}
            className="h-full w-full rounded-full object-contain"
            width={logoWidth}
            height={logoHeight}
          />
        </motion.div>
      ))}
    </>
  );
};*/

// Import styles

interface OrbItemProps {
  items: { name: string; image: string }[]; // Array of items
  orbitClass: string; // CSS class for orbit size
}

export const OrbitItems = ({ items, orbitClass }: OrbItemProps) => {
  return (
    <div className={`orbit-items ${orbitClass}`}>
      {items.map((item, i) => (
        <motion.div
          key={item.name}
          className="orbit-item"
          style={{ '--index': i / items.length } as React.CSSProperties} // Pass CSS variable
        >
          <Image
            src={item.image}
            alt={item.name}
            className="h-full w-full rounded-full object-contain"
            layout="fill"
          />
        </motion.div>
      ))}
    </div>
  );
};
