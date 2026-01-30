import React, { useState, useEffect, useRef } from 'react';
import styles from './EngineDetailPanel.module.css';
import { Icon } from './Icon';
import { SlotLogo } from './SlotLogo';
import { EngineConfig, ChannelConfig, MetricConfig } from '../types/engine';

interface EngineDetailPanelProps {
  engine: EngineConfig;
  onClose: () => void;
}

// Tab类型
type TabType = 'channel' | 'config' | 'metrics';

// 通道卡片组件
const ChannelCard: React.FC<{ channel: ChannelConfig }> = ({ channel }) => {
  const progressPercentage = (channel.queueProgress.current / channel.queueProgress.total) * 100;
  const concurrencyPercentage = channel.concurrencyRate;

  return (
    <div className={styles.channelCard}>
      <div className={styles.channelHeader}>
        <div className={styles.channelInfo}>
          <div className={styles.channelNameRow}>
            <span className={styles.channelName}>{channel.channelName}</span>
            <div className={styles.channelCodeWrapper}>
              <span className={styles.channelCode}>{channel.channelCode}</span>
            </div>
            {channel.isPreset && (
              <div className={styles.presetTag}>
                <Icon name="system-build" size={14} />
                <span>预置</span>
              </div>
            )}
          </div>
        </div>
        <button className={styles.editIconButton}>
          <Icon name="edit" size={16} />
        </button>
      </div>
      <div className={styles.channelBody}>
        <div className={styles.channelInfoList}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>可用应用</span>
            <span className={styles.infoValue}>{channel.availableApp}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>业务模式</span>
            <span className={styles.infoValue}>{channel.businessMode}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>队列超时</span>
            <span className={styles.infoValue}>{channel.queueTimeout}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>创建者</span>
            <span className={styles.infoValue}>{channel.creator}</span>
          </div>
        </div>
        <div className={styles.channelStatus}>
          <div className={styles.statusBadge}>
            <Icon name="dot" size={14} />
            <span>已启用</span>
          </div>
          <div className={styles.progressGroup}>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>队列</span>
                <span className={styles.progressValue}>{channel.queueProgress.current}/{channel.queueProgress.total}</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>并发系数</span>
                <span className={styles.progressValue}>{channel.concurrencyRate}%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${concurrencyPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 配置Tab组件
const ConfigTab: React.FC<{ engine: EngineConfig }> = ({ engine }) => {
  const clusterTypeMap: Record<string, string> = {
    'normal': '普通集群',
    'cloud-native': '云原生集群'
  };

  const isFlinkSession = engine.engineType === 'flink' && engine.flinkSubType === 'session';

  return (
    <div className={styles.configContainer}>
      {/* 分组1：引擎规模、最大并发数 */}
      <div className={styles.configGroup}>
        <div className={styles.configItem}>
          <span className={styles.configLabel}>引擎规模</span>
          <span className={styles.configValue}>{`${engine.engineScale.spec} x ${engine.engineScale.count}，${engine.engineScale.type}`}</span>
        </div>
        {engine.maxConcurrency && (
          <div className={styles.configItem}>
            <span className={styles.configLabel}>最大并发数</span>
            <div className={styles.configValueGroup}>
              <span className={styles.configValue}>{engine.maxConcurrency.value}</span>
              {engine.maxConcurrency.tooltip && (
                <span className={styles.configTip}>({engine.maxConcurrency.tooltip})</span>
              )}
            </div>
          </div>
        )}
        {isFlinkSession && engine.maxRunningCU !== undefined && (
          <div className={styles.configItem}>
            <span className={styles.configLabel}>最大运行CU数</span>
            <span className={styles.configValue}>{engine.maxRunningCU}</span>
          </div>
        )}
      </div>

      {/* 分组2：Flink Session 特有配置或通用配置 */}
      {isFlinkSession ? (
        <div className={styles.configGroup}>
          {engine.jmSpec && (
            <div className={styles.configItem}>
              <span className={styles.configLabel}>JM 规格</span>
              <span className={styles.configValue}>{engine.jmSpec}</span>
            </div>
          )}
          {engine.tmSpec && (
            <div className={styles.configItem}>
              <span className={styles.configLabel}>TM 规格</span>
              <span className={styles.configValue}>{engine.tmSpec}</span>
            </div>
          )}
          {engine.parallelCU && (
            <div className={styles.configItem}>
              <span className={styles.configLabel}>每并行CU</span>
              <span className={styles.configValue}>{engine.parallelCU}</span>
            </div>
          )}
          {engine.minWarmup && (
            <div className={styles.configItem}>
              <span className={styles.configLabel}>最小预热</span>
              <span className={styles.configValue}>{engine.minWarmup}</span>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.configGroup}>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>coordinator规格</span>
            <span className={styles.configValue}>{engine.coordinatorSpec}</span>
          </div>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>worker规格</span>
            <span className={styles.configValue}>{engine.workerSpec}</span>
          </div>
        </div>
      )}

      {/* 分组3：引擎版本、业务模式、集群类型 */}
      <div className={styles.configGroup}>
        <div className={styles.configItem}>
          <span className={styles.configLabel}>引擎版本</span>
          <span className={styles.configValue}>{engine.version}</span>
        </div>
        <div className={styles.configItem}>
          <span className={styles.configLabel}>业务模式</span>
          <span className={styles.configValue}>{engine.businessMode}</span>
        </div>
        <div className={styles.configItem}>
          <span className={styles.configLabel}>集群类型</span>
          <span className={styles.configValue}>{clusterTypeMap[engine.clusterType] || engine.clusterType}</span>
        </div>
      </div>

      {/* 分组4：创建者 */}
      <div className={styles.configGroup}>
        <div className={styles.configItem}>
          <span className={styles.configLabel}>创建者</span>
          <span className={styles.configValue}>{engine.creator}</span>
        </div>
      </div>
    </div>
  );
};

// 指标卡片组件
const MetricCard: React.FC<{ metric: MetricConfig }> = ({ metric }) => {
  const isLongUnit = metric.unit && metric.unit.length > 5; // Bytes/s 等长单位

  return (
    <div className={styles.metricCard} data-highlight={metric.highlight ? 'true' : undefined}>
      <div className={styles.metricInfo}>
        <p className={styles.metricLabel}>{metric.name}</p>
        <div className={`${styles.metricValueWrapper} ${isLongUnit ? styles.metricValueWrapperColumn : ''}`}>
          <p className={styles.metricValue}>{metric.value}</p>
          {metric.unit && <p className={styles.metricUnit}>{metric.unit}</p>}
        </div>
      </div>
      <div className={styles.metricChart}>
        {/* 简化的折线图表示 */}
        {metric.chartData && metric.chartData.length > 0 && (
          <svg width="60" height="49" viewBox="0 0 60 49" fill="none">
            <defs>
              <linearGradient id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="49">
                <stop offset="0%" stopColor="#1E76F0" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#1E76F0" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* 背景区域 */}
            <path
              d={`M0,${49 - (metric.chartData[0] / 100) * 49} ${metric.chartData.map((v, i) => `L${i * 10},${49 - (v / 100) * 49}`).join(' ')}`}
              fill={`url(#gradient-${metric.id})`}
            />
            {/* 折线 */}
            <path
              d={`M0,${49 - (metric.chartData[0] / 100) * 49} ${metric.chartData.map((v, i) => `L${i * 10},${49 - (v / 100) * 49}`).join(' ')}`}
              stroke="#1E76F0"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

// 指标Tab组件
interface MetricsTabProps {
  engine: EngineConfig;
  onCountdownChange: (countdown: number) => void;
  refreshTrigger?: number;
}

const MetricsTab: React.FC<MetricsTabProps> = ({ engine, onCountdownChange, refreshTrigger }) => {
  const initialMetrics = engine.metrics || [];
  const [metrics, setMetrics] = useState(initialMetrics);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  // 生成随机值
  const generateRandomValue = (metric: MetricConfig): number => {
    if (metric.name.includes('CPU') || metric.name.includes('内存')) {
      return Math.floor(Math.random() * 40) + 40; // 40-80%
    }
    if (metric.name.includes('Worker数') || metric.name.includes('CN数') || metric.name.includes('Slot 空闲数') || metric.name.includes('Task Manager')) {
      return Math.floor(Math.random() * 3) + 4; // 4-6
    }
    if (metric.name.includes('扫描')) {
      return Math.floor(Math.random() * 4) + 2; // 2-5
    }
    if (metric.name.includes('执行任务数') || metric.name.includes('等待任务数')) {
      return Math.floor(Math.random() * 5) + 2; // 2-6
    }
    return Math.floor(Math.random() * 50);
  };

  // 刷新数据
  const refreshMetrics = () => {
    setMetrics(prevMetrics =>
      prevMetrics.map(metric => {
        const newValue = generateRandomValue(metric);
        const newChartData = [...(metric.chartData || []), newValue].slice(-7);
        return {
          ...metric,
          value: newValue,
          chartData: newChartData
        };
      })
    );
    setCountdown(5); // 重置倒计时
  };

  // 更新倒计时到父组件
  useEffect(() => {
    onCountdownChange(countdown);
  }, [countdown, onCountdownChange]);

  // 监听强制刷新触发器
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      refreshMetrics();
    }
  }, [refreshTrigger]);

  // 更新指标数据和倒计时
  useEffect(() => {
    // 数据刷新定时器（每5秒）
    intervalRef.current = setInterval(() => {
      refreshMetrics();
    }, 5000);

    // 倒计时定时器（每1秒）
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // 六个指标分成三行，每行两个
  const firstRow = metrics.slice(0, 2);
  const secondRow = metrics.slice(2, 4);
  const thirdRow = metrics.slice(4, 6);

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX + 12, y: e.clientY + 12 });
  };

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <div
      className={styles.metricsContainer}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 第一行 */}
      <div className={styles.metricsGrid}>
        {firstRow.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* 第二行 */}
      <div className={styles.metricsGrid}>
        {secondRow.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* 第三行 */}
      <div className={styles.metricsGrid}>
        {thirdRow.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* 悬浮提示框 */}
      <div
        className={`${styles.metricTooltip} ${tooltipVisible ? styles.metricTooltipVisible : ''}`}
        style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }}
      >
        <p className={styles.metricTooltipTime}>2026/1/20 13:00:00</p>
        <div className={styles.metricTooltipContent}>
          <Icon name="dot" size={14} />
          <span>Slot 空闲数</span>
          <span>5</span>
        </div>
      </div>
    </div>
  );
};

export const EngineDetailPanel: React.FC<EngineDetailPanelProps> = ({ engine, onClose }) => {
  // 转换引擎类型
  const engineTypeMap: Record<string, 'Trino' | 'StarRocks' | 'Flink' | 'Hive'> = {
    trino: 'Trino',
    starrocks: 'StarRocks',
    flink: 'Flink',
    hive: 'Hive',
  };
  const engineType = engineTypeMap[engine.engineType] || 'Trino';

  // 获取通道列表，如果没有通道则返回空数组
  const channels = engine.channels || [];

  // 判断是否为 Flink 引擎
  const isFlinkEngine = engine.engineType === 'flink';

  // Tab状态 - Flink 引擎默认显示配置 Tab
  const [activeTab, setActiveTab] = useState<TabType>(isFlinkEngine ? 'config' : 'channel');

  // 倒计时状态
  const [countdown, setCountdown] = useState(5);

  // 刷新触发器
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 处理Tab切换
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // 处理强制刷新
  const handleManualRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className={styles.panel}>
      {/* 顶部引擎信息区域 */}
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.engineInfo}>
            <div className={styles.engineInfoRow}>
              <SlotLogo type={engineType} className={styles.engineLogo} />
              <span className={styles.engineName}>{engine.displayName}</span>
              <div className={styles.divider}></div>
              <span className={styles.clusterName}>{engine.engineName}</span>
              {engine.creationType === 'preset' && (
                <div className={styles.presetTag}>
                  <Icon name="system-build" size={14} />
                  <span>预置</span>
                </div>
              )}
            </div>
            <div className={styles.actionButtons}>
              <button className={styles.editButton}>
                <Icon name="edit" size={16} />
                <span>编辑</span>
              </button>
              <button className={styles.iconButton}>
                <Icon name="speed" size={16} />
              </button>
            </div>
          </div>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <Icon name="d-arrow-r" size={16} />
        </button>
      </div>

      {/* Tab 和搜索区域 */}
      <div className={styles.panelTabs}>
        <div className={styles.tabs}>
          {!isFlinkEngine && (
            <button
              className={`${styles.tab} ${activeTab === 'channel' ? styles.tabActive : ''}`}
              onClick={() => handleTabChange('channel')}
            >
              通道
            </button>
          )}
          <button
            className={`${styles.tab} ${activeTab === 'config' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('config')}
          >
            配置
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'metrics' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('metrics')}
          >
            指标
          </button>
        </div>
        {activeTab === 'metrics' ? (
          <div className={styles.metricsRefresh}>
            <span>{countdown}秒后自动刷新</span>
            <button className={styles.iconButton} onClick={handleManualRefresh}>
              <Icon name="recurring" size={16} />
            </button>
          </div>
        ) : (
          <div className={styles.searchBox}>
            <Icon name="search" size={16} />
            <span>搜索</span>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className={styles.panelContent}>
        {activeTab === 'channel' && (
          channels.length === 0 ? (
            <div className={styles.emptyState}>
              <Icon name="info" size={48} />
              <p>该引擎暂无通道</p>
            </div>
          ) : (
            channels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))
          )
        )}
        {activeTab === 'config' && <ConfigTab engine={engine} />}
        {activeTab === 'metrics' && <MetricsTab engine={engine} onCountdownChange={setCountdown} refreshTrigger={refreshTrigger} />}
      </div>
    </div>
  );
};
