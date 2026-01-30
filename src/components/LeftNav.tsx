import React from 'react';
import styles from './LeftNav.module.css';
import { Icon } from './Icon';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'compute-engine',
    label: '计算引擎',
    icon: 'cpu',
    active: true,
  },
  {
    id: 'storage-resource',
    label: '存储资源',
    icon: 'server',
    active: false,
  },
  {
    id: 'data-permission',
    label: '数据权限',
    icon: 'shield-keyhole',
    active: false,
    children: [
      {
        id: 'data-catalog-auth',
        label: '数据目录授权',
        icon: '',
        active: false,
      },
    ],
  },
];

export const LeftNav: React.FC = () => {
  return (
    <div className={styles.leftNav}>
      <div className={styles.menu}>
        {menuItems.map((item) => (
          <div key={item.id} className={styles.menuGroup}>
            <div className={`${styles.menuItem} ${item.active ? styles.active : ''}`}>
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
    </div>
  );
};
