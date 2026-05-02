'use client';

import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', fullPage = false }) => {
  return (
    <div className={[styles.wrapper, fullPage ? styles.fullPage : ''].filter(Boolean).join(' ')}>
      <div className={[styles.spinner, styles[size]].join(' ')} />
    </div>
  );
};

export default LoadingSpinner;
