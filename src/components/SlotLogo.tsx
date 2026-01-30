import React from 'react';
import styles from './SlotLogo.module.css';
import { Icon } from './Icon';
import { LOGO_TRINO, LOGO_FLINK, LOGO_AUTOMQ } from '../assets/images';

interface SlotLogoProps {
  className?: string;
  type?: 'Trino' | 'StarRocks' | 'Flink' | 'Hive' | 'AutoMQ';
}

export const SlotLogo: React.FC<SlotLogoProps> = ({
  className = '',
  type = 'Trino',
}) => {
  const iconMap: Record<typeof type, string> = {
    Trino: 'logo-trino',
    StarRocks: 'logo-starrocks',
    Flink: 'logo-flink',
    Hive: 'logo-hive',
    AutoMQ: 'logo-automq',
  };

  // Trino和Flink使用设计稿中提供的图片
  if (type === 'Trino') {
    return (
      <div className={`${styles.slotLogo} ${className}`}>
        <img src={LOGO_TRINO} alt="Trino" className={styles.logoImage} />
      </div>
    );
  }

  if (type === 'Flink') {
    return (
      <div className={`${styles.slotLogo} ${className}`}>
        <img src={LOGO_FLINK} alt="Flink" className={styles.logoImage} />
      </div>
    );
  }

  // AutoMQ使用SVG图标
  if (type === 'AutoMQ') {
    return (
      <div className={`${styles.slotLogo} ${className}`}>
        <img src={LOGO_AUTOMQ} alt="AutoMQ" className={styles.logoImage} />
      </div>
    );
  }

  // StarRocks图标需要特殊处理对齐
  const isStarRocks = type === 'StarRocks';

  return (
    <div className={`${styles.slotLogo} ${isStarRocks ? styles.slotLogoStarRocks : ''} ${className}`}>
      <Icon name={iconMap[type] as any} size={18} />
    </div>
  );
};
