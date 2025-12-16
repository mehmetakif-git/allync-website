import React from 'react';
import { cn } from '../../utils/cn';

interface ShinyTextProps {
  text: string;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({ text, className }) => {
  return (
    <p
      className={cn(
        'animate-shine bg-gradient-to-r from-gray-500 via-white to-gray-500 bg-[length:200%_auto] bg-clip-text',
        className
      )}
      style={{ color: 'transparent' }}
    >
      {text}
    </p>
  );
};
