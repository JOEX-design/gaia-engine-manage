import React, { useState, useMemo } from 'react';
import styles from './StorageResourcePage.module.css';
import { AutoMQCard } from '../components/AutoMQCard';
import { Icon } from '../components/Icon';
import { SlotLogo } from '../components/SlotLogo';
import { EngineDetailPanel } from '../components/EngineDetailPanel';
import { loadAutoMQConfigs } from '../config/engineConfigLoader';
import { EngineConfig } from '../types/engine';
import { shouldEngineBeVisible, WarehouseFeature } from '../config/warehouseFeatures';
import {
  TAB_DECOR_ACTIVE,
  TAB_DECOR_SMALL_ACTIVE,
} from '../assets/images';

interface WarehouseOption {
  id: string;
  name: string;
  icon: string;
}

const warehouseOptions: WarehouseOption[] = [
  { id: 'preset-etl', name: '预置ETL仓', icon: 'warehouse' },
];

interface StorageResourcePageProps {
  features: Record<string, WarehouseFeature>;
}

export const StorageResourcePage: React.FC<StorageResourcePageProps> = ({ features }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('preset-etl');
  const [warehouseDropdownOpen, setWarehouseDropdownOpen] = useState(false);

  // 详情面板状态
  const [selectedEngine, setSelectedEngine] = useState<EngineConfig | null>(null);

  // 加载AutoMQ引擎配置，并根据特性状态过滤
  const autoMQEngines = useMemo(() => {
    try {
      const allEngines = loadAutoMQConfigs();
      // 根据特性状态过滤引擎
      return allEngines.filter(engine => shouldEngineBeVisible(engine, features));
    } catch (error) {
      console.error('Failed to load AutoMQ configs:', error);
      return [];
    }
  }, [features]);

  // 处理引擎卡片点击
  const handleEngineClick = (engine: EngineConfig) => {
    setSelectedEngine(engine);
  };

  // 处理详情面板关闭
  const handleCloseDetailPanel = () => {
    setSelectedEngine(null);
  };

  return (
    <div className={styles.storageResourcePage}>
      {/* 卡片容器标签区域 */}
      <div className={styles.cardContainerTabs}>
        {/* AutoMQ标签页 */}
        <div className={styles.cardItem}>
          <div className={styles.tabContent}>
            <SlotLogo type="AutoMQ" className={styles.tabLogo} />
            <div className={styles.tabName}>
              <p>AutoMQ</p>
              <p>(1)</p>
            </div>
          </div>
          <img className={styles.tabDecor} src={TAB_DECOR_ACTIVE} alt="" />
          <img className={styles.tabDecorSmall} src={TAB_DECOR_SMALL_ACTIVE} alt="" />
        </div>

        {/* 仓库选择器 */}
        <div className={styles.warehouseSelector}>
          <div
            className={styles.selectControl}
            onClick={() => setWarehouseDropdownOpen(!warehouseDropdownOpen)}
          >
            <div className={styles.selectContent}>
              <span className={styles.selectIcon}>
                <Icon name={warehouseOptions.find(w => w.id === selectedWarehouse)?.icon as any || 'dashboard-plan'} size={14} />
              </span>
              <p className={styles.selectText}>
                {warehouseOptions.find(w => w.id === selectedWarehouse)?.name || '预置ETL仓'}
              </p>
            </div>
            <span className={styles.selectSuffix}>
              <Icon name="arrow-down" size={14} />
            </span>
          </div>

          {warehouseDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {warehouseOptions.map((option) => (
                <div
                  key={option.id}
                  className={`${styles.dropdownItem} ${selectedWarehouse === option.id ? styles.dropdownItemActive : ''}`}
                  onClick={() => {
                    setSelectedWarehouse(option.id);
                    setWarehouseDropdownOpen(false);
                  }}
                >
                  <span className={styles.dropdownIcon}>
                    <Icon name={option.icon as any} size={14} />
                  </span>
                  <span className={styles.dropdownText}>{option.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 页面内容区域 - 卡片和详情面板的容器 */}
      <div className={styles.pageContent}>
        {/* 卡片内容区域 */}
        <div className={styles.cardContent}>
          {/* AutoMQ引擎卡片 */}
          {autoMQEngines.map((engine) => (
            <AutoMQCard
              key={engine.id}
              engine={engine}
              onClick={() => handleEngineClick(engine)}
              isActive={selectedEngine?.id === engine.id}
            />
          ))}
        </div>

        {/* 引擎详情面板 */}
        {selectedEngine && (
          <div className={styles.detailPanelWrapper}>
            <EngineDetailPanel
              engine={selectedEngine}
              onClose={handleCloseDetailPanel}
            />
          </div>
        )}
      </div>
    </div>
  );
};
