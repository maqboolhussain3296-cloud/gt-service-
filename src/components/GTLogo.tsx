import React from 'react';

interface GTLogoProps {
  className?: string;
}

export const GTLogo: React.FC<GTLogoProps> = ({ className = 'w-11 h-11' }) => {
  return (
    <svg
      viewBox="0 0 140 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="GT Service Logo"
    >
      <defs>
        <linearGradient id="gtBlue" x1="18" y1="20" x2="72" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id="gtGreen" x1="20" y1="78" x2="128" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>

      {/* Top-right floating heart */}
      <path
        d="M107 14C107 9.8 103.6 7 100 7C97.4 7 95.3 8.5 94.3 10.3C93.3 8.5 91.2 7 88.6 7C85 7 81.6 9.8 81.6 14C81.6 20.4 90.4 26 94.3 29C98.2 26 107 20.4 107 14Z"
        fill="url(#gtGreen)"
      />

      {/* Left green leaf stem */}
      <path
        d="M23 76V46"
        stroke="#16A34A"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M23 44C18 39 18 33 23 29C28 33 28 39 23 44Z"
        fill="#22C55E"
      />
      <path
        d="M22 54C15 54 11 49 12 43C17 44 21 48 22 54Z"
        fill="#16A34A"
      />
      <path
        d="M24 54C31 54 35 49 34 43C29 44 25 48 24 54Z"
        fill="#22C55E"
      />
      <path
        d="M22 67C15 67 11 62 12 56C17 57 21 61 22 67Z"
        fill="#16A34A"
      />
      <path
        d="M24 67C31 67 35 62 34 56C29 57 25 61 24 67Z"
        fill="#22C55E"
      />

      {/* Outer House Roof (Blue left, Green/Blue right) */}
      <path
        d="M31 44L68 18L105 44"
        stroke="url(#gtBlue)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner House Frame Left (Blue) */}
      <path
        d="M42 81V47L68 29L75 34"
        stroke="url(#gtBlue)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner House Frame Right (Green) */}
      <path
        d="M74 33.5L94 47V81"
        stroke="url(#gtGreen)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Heart Inside House */}
      <path
        d="M80.5 55.5C80.5 50.8 76.7 47.5 72.6 47.5C69.7 47.5 67.4 49.2 66.2 51.3C65 49.2 62.7 47.5 59.8 47.5C55.7 47.5 51.9 50.8 51.9 55.5C51.9 62.8 61.8 69.2 66.2 72.6C70.6 69.2 80.5 62.8 80.5 55.5Z"
        fill="url(#gtGreen)"
      />

      {/* Right Medical / Delivery Bag */}
      <path
        d="M108 55V50.5C108 49.1 109.1 48 110.5 48H117.5C118.9 48 120 49.1 120 50.5V55"
        stroke="#0369A1"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="99"
        y="54"
        width="30"
        height="24"
        rx="5"
        fill="url(#gtGreen)"
      />
      <path
        d="M120 63.5C120 61.3 118.2 59.7 116.2 59.7C114.8 59.7 113.7 60.5 113.1 61.5C112.5 60.5 111.4 59.7 110 59.7C108 59.7 106.2 61.3 106.2 63.5C106.2 67 111 70 113.1 71.7C115.2 70 120 67 120 63.5Z"
        fill="#FFFFFF"
      />

      {/* Bottom Ground Bar */}
      <rect x="10" y="79" width="120" height="7" rx="3.5" fill="url(#gtGreen)" />
    </svg>
  );
};
