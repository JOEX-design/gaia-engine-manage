import React from 'react';
import styles from './LeftNav.module.css';
import { Icon } from './Icon';
import { FeatureNotEnabledGuide } from './FeatureNotEnabledGuide';
import { WarehouseFeature } from '../config/warehouseFeatures';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  children?: MenuItem[];
}

interface LeftNavProps {
  activePage?: 'compute-engine' | 'storage-resource' | 'warehouse-features';
  onPageChange?: (pageId: string) => void;
  features?: Record<string, WarehouseFeature>;
}

const menuItems: MenuItem[] = [
  {
    id: 'compute-engine',
    label: '计算引擎',
    icon: 'cpu',
    active: false,
  },
  {
    id: 'storage-resource',
    label: '存储资源',
    icon: 'server',
    active: false,
  },
  {
    id: 'warehouse-features',
    label: '数仓特性',
    icon: 'system-build',
    active: false,
  },
];

export const LeftNav: React.FC<LeftNavProps> = ({ activePage = 'compute-engine', onPageChange, features }) => {
  // 更新菜单项的激活状态
  const updatedMenuItems = menuItems.map(item => ({
    ...item,
    active: item.id === activePage,
  }));

  // 计算未开启特性的数量
  const notEnabledFeatureCount = features
    ? Object.values(features).filter(f => !f.enabled).length
    : 0;

  const handleMenuItemClick = (itemId: string) => {
    if (onPageChange) {
      onPageChange(itemId);
    }
  };

  const handleGuideClick = () => {
    if (onPageChange) {
      onPageChange('warehouse-features');
    }
  };

  return (
    <div className={styles.leftNav}>
      <div className={styles.menu}>
        {updatedMenuItems.map((item) => (
          <div key={item.id} className={styles.menuGroup}>
            <div
              className={`${styles.menuItem} ${item.active ? styles.active : ''}`}
              onClick={() => handleMenuItemClick(item.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.menuItemContent}>
                {item.icon && (
                  <span className={`${styles.icon} ${item.active ? styles.iconActive : ''}`}>
                    <Icon name={item.icon as any} size={18} />
                  </span>
                )}
                <span className={`${styles.label} ${item.active ? styles.labelActive : ''}`}>
                  {item.label}
                </span>
              </div>
              {item.children && (
                <span className={styles.arrowDown}>
                  <Icon name="arrow-down" size={16} />
                </span>
              )}
            </div>
            {item.children && (
              <div className={styles.subMenu}>
                {item.children.map((child) => (
                  <div key={child.id} className={styles.subMenuItem}>
                    <span className={styles.subLabel}>{child.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* 特性未开启引导 */}
      {features && (
        <div className={styles.guideWrapper}>
          <FeatureNotEnabledGuide
            count={notEnabledFeatureCount}
            features={features}
            onClick={handleGuideClick}
          />
        </div>
      )}
    </div>
  );
};
