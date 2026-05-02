'use client';

import React from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'yellow' | 'blue' | 'green' | 'red' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  const classes = [
    styles.button,
    styles[variant],
    size === 'sm' ? styles.sm : size === 'lg' ? styles.lg : '',
    fullWidth ? styles.full : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
