import React from 'react';
import styles from './CardTabs.module.css';
import { SlotLogo } from './SlotLogo';
import { Icon } from './Icon';
import {
  TAB_DECOR_ACTIVE,
  TAB_DECOR_INACTIVE,
  TAB_DECOR_SMALL_ACTIVE,
  TAB_DECOR_SMALL_INACTIVE,
} from '../assets/images';

export interface EngineTab {
  id: string;
  type: 'Trino' | 'StarRocks' | 'Flink' | 'Hive';
  name: string;
  count: number;
  active?: boolean;
}

interface CardTabsProps {
  tabs: EngineTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const CardTabs: React.FC<CardTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className={styles.container}>
      <div className={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <div
              key={tab.id}
              className={`${styles.tabItem} ${isActive ? styles.active : ''}`}
              onClick={() => onTabChange?.(tab.id)}
            >
              <div className={`${styles.tabContent} ${isActive ? styles.tabContentActive : ''}`}>
                <SlotLogo type={tab.type} className={styles.tabLogo} />
                <div className={`${styles.tabTitle} ${isActive ? styles.tabTitleActive : ''}`}>
                  <span>{tab.name}</span>
                  <span>({tab.count})</span>
                </div>
              </div>
              <img
                className={styles.tabDecor}
                src={isActive ? TAB_DECOR_ACTIVE : TAB_DECOR_INACTIVE}
                alt=""
              />
              <img
                className={styles.tabDecorSmall}
                src={isActive ? TAB_DECOR_SMALL_ACTIVE : TAB_DECOR_SMALL_INACTIVE}
                alt=""
              />
            </div>
          );
        })}
      </div>
      <div className={styles.filterSelect}>
        <div className={styles.selectControl}>
          <div className={styles.selectContent}>
            <span className={styles.selectIcon}>
              <Icon name="warehouse" size={14} />
            </span>
            <span className={styles.selectLabel}>预置ETL仓</span>
          </div>
          <span className={styles.selectArrow}>
            <Icon name="arrow-down" size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};
