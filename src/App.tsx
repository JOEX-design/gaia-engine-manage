import { useState, useMemo, useEffect } from 'react';
import styles from './App.module.css';
import { LeftNav } from './components/LeftNav';
import { TopNav } from './components/TopNav';
import { CardTabs, EngineTab } from './components/CardTabs';
import { EngineCard } from './components/EngineCard';
import { EngineDetailPanel } from './components/EngineDetailPanel';
import { FlinkSidebar } from './components/FlinkSidebar';
import { ResourcePoolHeader } from './components/ResourcePoolHeader';
import { Search } from './components/Search';
import { EditResourcePoolModal } from './components/EditResourcePoolModal';
import { StorageResourcePage } from './pages/StorageResourcePage';
import { WarehouseFeaturesPage } from './pages/WarehouseFeaturesPage';
import { loadEngineConfigs, getEngineTypes, getResourcePoolsByType } from './config/engineConfigLoader';
import { EngineConfig, FlinkEngineSubType, ChannelConfig, ResourcePoolConfig } from './types/engine';
import { initialFeatures, shouldEngineBeVisible, isResourcePoolDisabled, WarehouseFeature } from './config/warehouseFeatures';

// 引擎类型映射（用于 Tab 显示）
const ENGINE_TYPE_MAP: Record<string, { type: string; name: string }> = {
  trino: { type: 'Trino', name: 'Trino' },
  starrocks: { type: 'StarRocks', name: 'StarRocks' },
  flink: { type: 'Flink', name: 'Flink' },
  hive: { type: 'Hive', name: 'Hive' },
};

function App() {
  // 页面状态：计算引擎、存储资源或数仓特性
  const [activePage, setActivePage] = useState<'compute-engine' | 'storage-resource' | 'warehouse-features'>('compute-engine');

  const [activeTab, setActiveTab] = useState<string>('trino');
  const [enginesData, setEnginesData] = useState<EngineConfig[]>([]);
  const [poolsData, setPoolsData] = useState<ResourcePoolConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEngineId, setSelectedEngineId] = useState<string | null>(null);
  const [flinkSubType, setFlinkSubType] = useState<FlinkEngineSubType>('session');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 资源池编辑弹窗状态
  const [poolEditVisible, setPoolEditVisible] = useState(false);
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);

  // 数仓特性状态
  const [features, setFeatures] = useState<Record<string, WarehouseFeature>>(initialFeatures);

  // 加载引擎配置数据和资源池数据
  useEffect(() => {
    try {
      const configs = loadEngineConfigs();
      setEnginesData(configs);

      // 加载所有资源池数据
      const realtimePools = getResourcePoolsByType('realtime');
      const batchPools = getResourcePoolsByType('batch');
      setPoolsData([...realtimePools, ...batchPools]);
    } catch (error) {
      console.error('Failed to load configs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedEngineId(null);
    setSearchQuery('');
    // 切换到Flink时，默认选中session类型
    if (tabId === 'flink') {
      setFlinkSubType('session');
    }
  };

  // 处理页面切换
  const handlePageChange = (pageId: string) => {
    if (pageId === 'storage-resource') {
      setActivePage('storage-resource');
    } else if (pageId === 'warehouse-features') {
      setActivePage('warehouse-features');
    } else if (pageId === 'compute-engine') {
      setActivePage('compute-engine');
    }
  };

  // 处理特性开关切换
  const handleFeatureToggle = (featureId: string) => {
    setFeatures(prev => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        enabled: !prev[featureId].enabled,
      },
    }));
  };

  const handleEngineClick = (engineId: string) => {
    setSelectedEngineId(engineId);
  };

  const handleCloseDetailPanel = () => {
    setSelectedEngineId(null);
  };

  // 处理资源池编辑按钮点击
  const handlePoolEditClick = (poolId: string) => {
    setSelectedPoolId(poolId);
    setPoolEditVisible(true);
  };

  // 处理资源池更新
  const handlePoolUpdate = (updatedPool: Partial<ResourcePoolConfig>) => {
    if (selectedPoolId) {
      setPoolsData(prevPools =>
        prevPools.map(pool =>
          pool.id === selectedPoolId
            ? { ...pool, ...updatedPool }
            : pool
        )
      );
      setPoolEditVisible(false);
      setSelectedPoolId(null);
    }
  };

  // 处理资源池编辑取消
  const handlePoolEditCancel = () => {
    setPoolEditVisible(false);
    setSelectedPoolId(null);
  };

  // 处理引擎配置更新
  const handleEngineUpdate = (updatedEngine: Partial<EngineConfig>) => {
    if (selectedEngineId) {
      setEnginesData(prevEngines =>
        prevEngines.map(engine =>
          engine.id === selectedEngineId
            ? { ...engine, ...updatedEngine }
            : engine
        )
      );
    }
  };

  // 处理通道配置更新
  const handleChannelUpdate = (channelId: string, updatedChannel: Partial<ChannelConfig>) => {
    if (selectedEngineId) {
      setEnginesData(prevEngines =>
        prevEngines.map(engine => {
          if (engine.id === selectedEngineId && engine.channels) {
            return {
              ...engine,
              channels: engine.channels.map(channel =>
                channel.id === channelId
                  ? { ...channel, ...updatedChannel }
                  : channel
              )
            };
          }
          return engine;
        })
      );
    }
  };

  const handleFlinkSubTypeChange = (subType: FlinkEngineSubType) => {
    setFlinkSubType(subType);
    setSelectedEngineId(null);
  };

  // 动态生成 tabs，基于配置文件中的引擎类型（根据特性状态过滤）
  const engineTabs: EngineTab[] = useMemo(() => {
    const engineTypes = getEngineTypes();
    return engineTypes.map((type) => {
      const typeInfo = ENGINE_TYPE_MAP[type] || { type: type, name: type };
      // 根据特性状态过滤后计算引擎数量
      const visibleEngines = enginesData.filter(e =>
        e.engineType === type && shouldEngineBeVisible(e, features)
      );
      const count = visibleEngines.length;
      return {
        id: type,
        type: typeInfo.type as any,
        name: typeInfo.name,
        active: type === activeTab,
        count,
      };
    });
  }, [enginesData, activeTab, features]);

  // 获取当前选中的引擎列表（带搜索过滤和特性过滤）
  const currentEngines = useMemo(() => {
    let baseFilter = enginesData.filter(engine => engine.engineType === activeTab);

    // 如果是Flink，需要根据子类型进一步过滤
    if (activeTab === 'flink') {
      baseFilter = baseFilter.filter(engine => engine.flinkSubType === flinkSubType);
    }

    // 特性开关过滤：根据特性状态过滤引擎
    baseFilter = baseFilter.filter(engine => shouldEngineBeVisible(engine, features));

    // 搜索过滤：按 displayName 或 engineName 匹配
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      baseFilter = baseFilter.filter(engine =>
        engine.displayName.toLowerCase().includes(query) ||
        engine.engineName.toLowerCase().includes(query)
      );
    }

    return baseFilter;
  }, [enginesData, activeTab, flinkSubType, searchQuery]);

  // 获取当前资源池列表（仅当flinkSubType为资源池类型时）
  const currentPools = useMemo(() => {
    if (activeTab !== 'flink') {
      return [];
    }

    if (flinkSubType === 'resource-pool-realtime') {
      return poolsData.filter(pool => pool.poolType === 'realtime');
    }

    if (flinkSubType === 'resource-pool-batch') {
      return poolsData.filter(pool => pool.poolType === 'batch');
    }

    return [];
  }, [activeTab, flinkSubType, poolsData]);

  // 计算每个资源池的引擎数量
  const poolEngineCount = useMemo(() => {
    const counts: Record<string, number> = {};
    currentPools.forEach(pool => {
      counts[pool.id] = enginesData.filter(
        engine => engine.resourcePoolId === pool.id
      ).length;
    });
    return counts;
  }, [enginesData, currentPools]);

  // 获取当前选中的引擎
  const selectedEngine = useMemo(() => {
    return enginesData.find(e => e.id === selectedEngineId);
  }, [enginesData, selectedEngineId]);

  // 判断当前是否是Flink tab
  const isFlinkTab = activeTab === 'flink';

  // 判断当前是否是资源池类型
  const isResourcePoolType = isFlinkTab && (
    flinkSubType === 'resource-pool-realtime' || flinkSubType === 'resource-pool-batch'
  );

  // 计算被禁用的 Flink 子类型
  const disabledFlinkSubTypes = useMemo(() => {
    const disabled: FlinkEngineSubType[] = [];
    // "实时任务资源池"由"实时任务"特性控制
    if (!features['realtime-task'].enabled) {
      disabled.push('resource-pool-realtime');
    }
    return disabled;
  }, [features]);

  if (loading) {
    return <div className={styles.app}>Loading...</div>;
  }

  return (
    <div className={styles.app}>
      <TopNav />
      <div className={styles.mainContainer}>
        <LeftNav activePage={activePage} onPageChange={handlePageChange} features={features} />
        <div className={styles.contentArea}>
          {activePage === 'warehouse-features' ? (
            /* 数仓特性页面 */
            <div className={styles.cardContainer}>
              <WarehouseFeaturesPage
                features={features}
                onFeatureToggle={handleFeatureToggle}
              />
            </div>
          ) : activePage === 'storage-resource' ? (
            /* 存储资源页面 */
            <div className={styles.cardContainer}>
              <StorageResourcePage features={features} />
            </div>
          ) : (
            /* 计算引擎页面 */
            <div className={styles.cardContainer}>
            <CardTabs tabs={engineTabs} activeTab={activeTab} onTabChange={handleTabChange} />
            <div className={`${styles.tabContent} ${selectedEngine ? styles.tabContentWithPanel : ''} ${isFlinkTab ? styles.tabContentWithSidebar : ''}`}>
              {isFlinkTab && (
                <FlinkSidebar
                  selectedSubType={flinkSubType}
                  onSubTypeChange={handleFlinkSubTypeChange}
                  disabledSubTypes={disabledFlinkSubTypes}
                />
              )}
              <div className={`${styles.engineCards} ${isResourcePoolType ? styles.resourcePool : ''}`}>
                {/* 资源池类型：显示资源池标题（独立于引擎列表容器） */}
                {isResourcePoolType && currentPools.map((pool) => (
                  <ResourcePoolHeader
                    key={pool.id}
                    pool={pool}
                    engineCount={poolEngineCount[pool.id]}
                    disabled={isResourcePoolDisabled(pool.id, features)}
                    onEditClick={() => handlePoolEditClick(pool.id)}
                  />
                ))}
                {/* 资源池类型：引擎列表和抽屉的容器 */}
                {isResourcePoolType ? (
                  <div className={styles.resourcePoolContentWrapper}>
                    <div className={styles.resourcePoolEnginesContainer}>
                      <div className={styles.searchBarWrapper}>
                        <Search
                          placeholder="搜索"
                          value={searchQuery}
                          onChange={setSearchQuery}
                        />
                      </div>
                      {currentEngines.map((engine) => (
                        <EngineCard
                          key={engine.id}
                          engine={engine}
                          isActive={selectedEngineId === engine.id}
                          hasPanel={selectedEngineId !== null}
                          onClick={() => handleEngineClick(engine.id)}
                        />
                      ))}
                    </div>
                    {selectedEngine && (
                      <div className={styles.detailPanelWrapper}>
                        <EngineDetailPanel
                          engine={selectedEngine}
                          onClose={handleCloseDetailPanel}
                          onEngineUpdate={handleEngineUpdate}
                          onChannelUpdate={handleChannelUpdate}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  // 非资源池类型：直接显示引擎卡片
                  currentEngines.map((engine) => (
                    <EngineCard
                      key={engine.id}
                      engine={engine}
                      isActive={selectedEngineId === engine.id}
                      hasPanel={selectedEngineId !== null}
                      onClick={() => handleEngineClick(engine.id)}
                    />
                  ))
                )}
              </div>
              {/* 非资源池类型的抽屉（在 engineCards 外部，与 engineCards 并排） */}
              {!isResourcePoolType && selectedEngine && (
                <div className={styles.detailPanelWrapper}>
                  <EngineDetailPanel
                    engine={selectedEngine}
                    onClose={handleCloseDetailPanel}
                    onEngineUpdate={handleEngineUpdate}
                    onChannelUpdate={handleChannelUpdate}
                  />
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      {/* 资源池编辑弹窗 */}
      {poolEditVisible && selectedPoolId && (
        <EditResourcePoolModal
          pool={currentPools.find(p => p.id === selectedPoolId)!}
          visible={poolEditVisible}
          onSave={handlePoolUpdate}
          onCancel={handlePoolEditCancel}
        />
      )}
    </div>
  );
}

export default App;
