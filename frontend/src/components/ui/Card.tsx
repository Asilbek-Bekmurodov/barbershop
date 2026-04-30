import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
  ...rest
}: CardProps) {
  return (
    <div
      className={`
        bg-[#161b22] border border-[#30363d] rounded-lg
        ${hoverable ? 'hover:border-[#484f58] transition-colors duration-200 cursor-pointer' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
}
