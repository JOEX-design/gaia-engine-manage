import React, { useState } from 'react';
import styles from './FeatureNotEnabledGuide.module.css';
import { WarehouseFeature } from '../config/warehouseFeatures';
import { Icon } from './Icon';

interface FeatureNotEnabledGuideProps {
  count: number;
  features: Record<string, WarehouseFeature>;
  onClick: () => void;
}

export const FeatureNotEnabledGuide: React.FC<FeatureNotEnabledGuideProps> = ({ count, features, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (count === 0) {
    return null;
  }

  // 获取未开启的特性列表
  const notEnabledFeatures = Object.values(features).filter(f => !f.enabled);

  return (
    <div
      className={styles.guide}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.featureList}>
        {notEnabledFeatures.map((feature) => (
          <div key={feature.id} className={styles.featureItem}>
            <p className={styles.featureName}>{feature.name}</p>
            <p className={styles.featureApp}>数开</p>
          </div>
        ))}
      </div>
      <div className={styles.guideFooter} onClick={onClick}>
        <div className={styles.footerIcon}>
          {isHovered ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.6365 4.59139V4.56096C14.6365 4.50008 14.6062 4.46964 14.6062 4.4392L13.7274 2.4303C13.4244 1.76067 12.788 1.33454 12.0608 1.33454H3.90925C3.18198 1.3041 2.54562 1.73023 2.24259 2.39986L1.3638 4.40877C1.3335 4.4392 1.3335 4.50008 1.3335 4.53052V12.8401C1.3335 13.8445 2.15168 14.6663 3.15168 14.6663H12.8486C13.8486 14.6663 14.6668 13.8445 14.6668 12.8401V4.65227C14.6365 4.62183 14.6365 4.59139 14.6365 4.59139V4.59139ZM12.5759 2.88687L13.0911 4.04351H10.0911V2.52162H12.0305C12.2729 2.52162 12.485 2.67381 12.5759 2.88687ZM8.87895 7.39168H7.06077V2.52162H8.87895V7.39168ZM3.3638 2.88687C3.45471 2.67381 3.66683 2.52162 3.90925 2.52162H5.84865V4.04351H2.84865L3.3638 2.88687ZM13.4244 12.8705C13.4244 13.2053 13.1517 13.4793 12.8183 13.4793H3.12137C2.78804 13.4793 2.51531 13.2053 2.51531 12.8705V5.26103H5.84865V7.39168C5.84865 8.06132 6.3941 8.6092 7.06077 8.6092H8.87895C9.54562 8.6092 10.0911 8.06132 10.0911 7.39168V5.26103H13.4244V12.8705V12.8705Z" fill="white"/>
            </svg>
          ) : (
            <span>{count}</span>
          )}
        </div>
        <div className={styles.footerTextContainer}>
          <p className={styles.footerText}>特性未开启</p>
        </div>
        <div className={styles.footerArrow}>
          <Icon name="arrow-rightup" size={20} />
        </div>
      </div>
    </div>
  );
};
