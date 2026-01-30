import React from 'react';
import styles from './TopNav.module.css';
import { Icon } from './Icon';

interface NavItem {
  id: string;
  label: string;
  active?: boolean;
}

const mainNavItems: NavItem[] = [
  { id: 'general', label: '通用管理', active: false },
  { id: 'warehouse', label: '仓管理', active: true },
];

export const TopNav: React.FC = () => {
  return (
    <div className={styles.topNav}>
      <div className={styles.leftSection}>
        <div className={styles.brandSection}>
          <div className={styles.menuIcon}>
            <Icon name="grid" size={20} />
          </div>
          <span className={styles.brandLabel}>系统管理</span>
        </div>
        <div className={styles.navItems}>
          {mainNavItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.navItem} ${item.active ? styles.active : ''}`}
            >
              <span className={`${styles.navLabel} ${item.active ? styles.activeLabel : ''}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.toolIcons}>
          <div className={styles.toolIcon}>
            <Icon name="search" size={20} />
          </div>
          <div className={styles.toolIcon}>
            <Icon name="bell" size={20} />
          </div>
          <div className={styles.toolIcon}>
            <Icon name="setting" size={20} />
          </div>
        </div>
        <div className={styles.clusterSelector}>
          <span className={styles.clusterLabel}>demo验证集群</span>
          <span className={styles.clusterArrow}>
            <Icon name="arrow-down" size={20} />
          </span>
        </div>
      </div>
    </div>
  );
};
