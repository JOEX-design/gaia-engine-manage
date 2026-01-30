import React from 'react';
import styles from './Tag.module.css';

interface TagProps {
  className?: string;
  text?: string;
  type?: 'default' | 'invalid';
}

export const Tag: React.FC<TagProps> = ({
  className = '',
  text = '标签',
  type = 'default',
}) => {
  const isInvalid = type === 'invalid';

  return (
    <div className={`${styles['tag']} ${isInvalid ? styles['tag-invalid'] : styles['tag-default']} ${className}`}>
      <span className={styles['tag-text']}>{text}</span>
    </div>
  );
};
