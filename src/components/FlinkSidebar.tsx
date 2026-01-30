import React from 'react';
import styles from './FlinkSidebar.module.css';
import { Icon } from './Icon';
import { FlinkEngineSubType } from '../types/engine';

export interface FlinkSidebarProps {
  selectedSubType: FlinkEngineSubType;
  onSubTypeChange: (subType: FlinkEngineSubType) => void;
}

interface SidebarSection {
  type: 'section' | 'item';
  id?: FlinkEngineSubType;
  label: string;
  icon?: string;
}

const SIDEBAR_ITEMS: SidebarSection[] = [
  {
    type: 'section',
    label: '引擎',
    icon: 'dashboard-plan',
  },
  {
    type: 'item',
    id: 'session',
    label: 'Session型引擎',
  },
  {
    type: 'section',
    label: '资源池',
    icon: 'space-line',
  },
  {
    type: 'item',
    id: 'resource-pool-realtime',
    label: '实时任务资源池',
  },
  {
    type: 'item',
    id: 'resource-pool-batch',
    label: '离线集成资源池',
  },
];

export const FlinkSidebar: React.FC<FlinkSidebarProps> = ({
  selectedSubType,
  onSubTypeChange,
}) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.verticalTabs}>
        {SIDEBAR_ITEMS.map((item, index) => {
          if (item.type === 'section') {
            const isResourcePool = item.label === '资源池';
            if (isResourcePool) {
              // 资源池有特殊结构：带分隔线的容器
              return (
                <div key={index} className={styles.section}>
                  <div className={styles.sectionHeaderWithBorder}>
                    {item.icon && (
                      <span className={styles.sectionIcon}>
                        <Icon name={item.icon as any} size={14} />
                      </span>
                    )}
                    <span className={styles.sectionLabel}>{item.label}</span>
                  </div>
                </div>
              );
            }
            // 普通section（引擎）
            return (
              <div key={index} className={styles.section}>
                <div className={styles.sectionHeader}>
                  {item.icon && (
                    <span className={styles.sectionIcon}>
                      <Icon name={item.icon as any} size={14} color="var(--color-primary)" />
                    </span>
                  )}
                  <span className={styles.sectionLabel}>{item.label}</span>
                </div>
              </div>
            );
          }

          const isActive = item.id === selectedSubType;

          return (
            <div
              key={index}
              className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
              onClick={() => item.id && onSubTypeChange(item.id)}
            >
              <span className={styles.itemLabel}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
