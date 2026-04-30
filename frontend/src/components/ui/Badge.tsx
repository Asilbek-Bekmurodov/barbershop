import React from 'react';

type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'gray';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-[#3fb950]/10 text-[#3fb950] border-[#3fb950]/30',
  yellow: 'bg-[#ecad0a]/10 text-[#ecad0a] border-[#ecad0a]/30',
  red: 'bg-[#f85149]/10 text-[#f85149] border-[#f85149]/30',
  blue: 'bg-[#209dd7]/10 text-[#209dd7] border-[#209dd7]/30',
  purple: 'bg-[#753991]/10 text-[#a371c5] border-[#753991]/30',
  gray: 'bg-[#30363d]/50 text-[#8b949e] border-[#30363d]',
};

const dotClasses: Record<BadgeVariant, string> = {
  green: 'bg-[#3fb950]',
  yellow: 'bg-[#ecad0a]',
  red: 'bg-[#f85149]',
  blue: 'bg-[#209dd7]',
  purple: 'bg-[#a371c5]',
  gray: 'bg-[#8b949e]',
};

export default function Badge({ variant = 'gray', children, dot = false, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`} />
      )}
      {children}
    </span>
  );
}
