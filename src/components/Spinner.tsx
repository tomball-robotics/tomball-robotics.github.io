import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  text?: string;
  size?: number; // Size in pixels for the icon
  textColor?: string; // Tailwind class for text color
}

const Spinner: React.FC<SpinnerProps> = ({ className, text, size = 24, textColor = 'text-gray-600' }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <Loader2 className="animate-spin text-[#0d2f60]" size={size} />
      {text && <p className={cn("text-lg", textColor)}>{text}</p>}
    </div>
  );
};

export default Spinner;