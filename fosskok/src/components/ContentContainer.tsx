import React, { ReactNode } from 'react';
import styles from './ContentContainer.module.css';

interface ContentContainerProps {
  children: ReactNode;
  className?: string;
}

const ContentContainer = ({ children, className = '' }: ContentContainerProps) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {children}
    </div>
  );
};

export default ContentContainer;
