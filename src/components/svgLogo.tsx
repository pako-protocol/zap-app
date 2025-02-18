import type { SVGProps } from 'react';
import React from 'react';

const SvgLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 20 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M100 63.58L1.5 0V102.74H198.5V0L100 63.58Z" fill="black" />
    <path
      d="M100 200L198.5 102.74L100 63.58L1.5 102.74L100 200Z"
      fill="#A6A6A6"
    />
    <path
      d="M78.3896 178.66L99.9996 200L121.61 178.66L99.9996 157.18L78.3896 178.66Z"
      fill="black"
    />
    <path
      d="M1.5 102.74L100 63.58L198.5 102.74L100 157.18L1.5 102.74Z"
      fill="#333333"
    />
  </svg>
);

export default SvgLogo;
