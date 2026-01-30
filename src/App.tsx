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
import { loadEngineConfigs, getEngineTypes, getResourcePoolsByType } from './config/engineConfigLoader';
import { EngineConfig, FlinkEngineSubType } from './types/engine';

// 引擎类型映射（用于 Tab 显示）
const ENGINE_TYPE_MAP: Record<string, { type: string; name: string }> = {
  trino: { type: 'Trino', name: 'Trino' },
  starrocks: { type: 'StarRocks', name: 'StarRocks' },
  flink: { type: 'Flink', name: 'Flink' },
  hive: { type: 'Hive', name: 'Hive' },
};

function App() {
  const [activeTab, setActiveTab] = useState<string>('trino');
  const [enginesData, setEnginesData] = useState<EngineConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEngineId, setSelectedEngineId] = useState<string | null>(null);
  const [flinkSubType, setFlinkSubType] = useState<FlinkEngineSubType>('session');
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 加载引擎配置数据
  useEffect(() => {
    try {
      const configs = loadEngineConfigs();
      setEnginesData(configs);
    } catch (error) {
      console.error('Failed to load engine configs:', error);
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

  const handleEngineClick = (engineId: string) => {
    setSelectedEngineId(engineId);
  };

  const handleCloseDetailPanel = () => {
    setSelectedEngineId(null);
  };

  const handleFlinkSubTypeChange = (subType: FlinkEngineSubType) => {
    setFlinkSubType(subType);
    setSelectedEngineId(null);
    setSelectedPoolId(null);
  };

  // 动态生成 tabs，基于配置文件中的引擎类型
  const engineTabs: EngineTab[] = useMemo(() => {
    const engineTypes = getEngineTypes();
    return engineTypes.map((type) => {
      const typeInfo = ENGINE_TYPE_MAP[type] || { type: type, name: type };
      const count = enginesData.filter(e => e.engineType === type).length;
      return {
        id: type,
        type: typeInfo.type as any,
        name: typeInfo.name,
        active: type === activeTab,
        count,
      };
    });
  }, [enginesData, activeTab]);

  // 获取当前选中的引擎列表（带搜索过滤）
  const currentEngines = useMemo(() => {
    let baseFilter = enginesData.filter(engine => engine.engineType === activeTab);

    // 如果是Flink，需要根据子类型进一步过滤
    if (activeTab === 'flink') {
      baseFilter = baseFilter.filter(engine => engine.flinkSubType === flinkSubType);
    }

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
      return getResourcePoolsByType('realtime');
    }

    if (flinkSubType === 'resource-pool-batch') {
      return getResourcePoolsByType('batch');
    }

    return [];
  }, [activeTab, flinkSubType]);

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

  if (loading) {
    return <div className={styles.app}>Loading...</div>;
  }

  return (
    <div className={styles.app}>
      <TopNav />
      <div className={styles.mainContainer}>
        <LeftNav />
        <div className={styles.contentArea}>
          <div className={styles.cardContainer}>
            <CardTabs tabs={engineTabs} activeTab={activeTab} onTabChange={handleTabChange} />
            <div className={`${styles.tabContent} ${selectedEngine ? styles.tabContentWithPanel : ''} ${isFlinkTab ? styles.tabContentWithSidebar : ''}`}>
              {isFlinkTab && (
                <FlinkSidebar
                  selectedSubType={flinkSubType}
                  onSubTypeChange={handleFlinkSubTypeChange}
                />
              )}
              <div className={`${styles.engineCards} ${isResourcePoolType ? styles.resourcePool : ''}`}>
                {/* 资源池类型：显示资源池标题（独立于引擎列表容器） */}
                {isResourcePoolType && currentPools.map((pool) => (
                  <ResourcePoolHeader key={pool.id} pool={pool} />
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
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
