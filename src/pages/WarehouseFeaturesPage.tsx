import React from 'react';
import styles from './WarehouseFeaturesPage.module.css';
import { WarehouseFeature } from '../config/warehouseFeatures';

interface WarehouseFeaturesPageProps {
  features: Record<string, WarehouseFeature>;
  onFeatureToggle: (featureId: string) => void;
}

export const WarehouseFeaturesPage: React.FC<WarehouseFeaturesPageProps> = ({ features, onFeatureToggle }) => {
  // 将 features 对象转换为数组
  const featureList = Object.values(features);
  return (
    <div className={styles.warehouseFeaturesPage}>
      {/* 页面标题 */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>数仓特性</h1>
      </div>

      {/* 表格容器 */}
      <div className={styles.tableContainer}>
        {/* 表格列容器 */}
        <div className={styles.table}>
          {/* 特性名列 */}
          <div className={styles.tableColumn} style={{ width: '240px' }}>
            <div className={styles.tableHeader}>
              <span>特性名</span>
            </div>
            {featureList.map((feature) => (
              <div key={feature.id} className={styles.tableCell}>
                <span className={styles.featureName}>{feature.name}</span>
              </div>
            ))}
          </div>

          {/* 特性开关列 */}
          <div className={styles.tableColumn} style={{ width: '160px' }}>
            <div className={styles.tableHeader}>
              <span>特性开关</span>
            </div>
            {featureList.map((feature) => (
              <div key={feature.id} className={styles.tableCell}>
                <div className={styles.switchCell}>
                  <div
                    className={`${styles.switch} ${feature.enabled ? styles.switchOn : styles.switchOff}`}
                    onClick={() => onFeatureToggle(feature.id)}
                  >
                    <div className={styles.switchToggle}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 已开启空间列 */}
          <div className={styles.tableColumn} style={{ flex: '1 0 0' }}>
            <div className={styles.tableHeader}>
              <span>已开启空间</span>
            </div>
            {featureList.map((feature) => (
              <div key={feature.id} className={styles.tableCell}>
                {feature.enabled && feature.enabledSpaces ? (
                  <span className={styles.enabledSpaces}>{feature.enabledSpaces.join('、')}</span>
                ) : (
                  <span className={styles.emptyValue}>-</span>
                )}
              </div>
            ))}
          </div>

          {/* 可用应用列 */}
          <div className={styles.tableColumn} style={{ flex: '1 0 0' }}>
            <div className={styles.tableHeader}>
              <span>可用应用</span>
            </div>
            {featureList.map((feature) => (
              <div key={feature.id} className={styles.tableCell}>
                {feature.enabled && feature.availableApp ? (
                  <span className={styles.availableApp}>{feature.availableApp}</span>
                ) : (
                  <span className={styles.emptyValue}>-</span>
                )}
              </div>
            ))}
          </div>

          {/* 操作列 */}
          <div className={styles.tableColumn} style={{ width: '160px' }}>
            <div className={styles.tableHeader}>
              <span>操作</span>
            </div>
            {featureList.map((feature) => (
              <div key={feature.id} className={styles.tableCell}>
                {feature.enabled ? (
                  <button className={styles.actionButton}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 7.333V2M8 14V8.667M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.00003 9.33325V9.34125M8.00003 11.6666V11.6746" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                ) : (
                  <span className={styles.emptyValue}>-</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
