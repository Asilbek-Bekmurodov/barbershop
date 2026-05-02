'use client';

import React from 'react';
import styles from './Badge.module.css';

type BadgeVariant =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'verified'
  | 'unverified'
  | 'admin'
  | 'barber'
  | 'client';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ variant, children, className }) => {
  const classes = [styles.badge, styles[variant], className || ''].filter(Boolean).join(' ');

  return <span className={classes}>{children}</span>;
};

export default Badge;
