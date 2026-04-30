import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          border-[#30363d]
          border-t-[#ecad0a]
          animate-spin
        `}
        role="status"
        aria-label="Yuklanmoqda..."
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-[#0d1117] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-[3px] border-[#30363d] border-t-[#ecad0a] animate-spin" />
        <p className="mono text-[#ecad0a] text-sm tracking-widest">YUKLANMOQDA...</p>
      </div>
    </div>
  );
}
