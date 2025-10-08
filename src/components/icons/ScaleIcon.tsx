import React from 'react';

export const ScaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m16 16-4-4-4 4" />
    <path d="M12 2v4" />
    <path d="M21 12H3" />
    <path d="M7 12l-2 6" />
    <path d="M17 12l2 6" />
    <path d="M5 18h.01" />
    <path d="M19 18h.01" />
    <path d="M5 18a4 4 0 0 0 4 0" />
    <path d="M15 18a4 4 0 0 0 4 0" />
  </svg>
);
