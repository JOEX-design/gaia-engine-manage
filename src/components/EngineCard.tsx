import React, { useState, useEffect } from 'react';
import styles from './EngineCard.module.css';
import { SlotLogo } from './SlotLogo';
import { Tag } from './Tag';
import { Icon } from './Icon';
import { AnimatedNumber } from './AnimatedNumber';
import { EngineConfig } from '../types/engine';

// 引擎类型映射
const ENGINE_TYPE_MAP: Record<string, 'Trino' | 'StarRocks' | 'Flink' | 'Hive'> = {
  trino: 'Trino',
  starrocks: 'StarRocks',
  flink: 'Flink',
  hive: 'Hive',
};

interface EngineCardProps {
  engine: EngineConfig;
  isActive?: boolean;
  hasPanel?: boolean;
  onClick?: () => void;
}

// 生成随机刷新间隔（4、8、12秒）
const getRandomInterval = () => {
  const intervals = [4000, 8000, 12000];
  return intervals[Math.floor(Math.random() * intervals.length)];
};

export const EngineCard: React.FC<EngineCardProps> = ({ engine, isActive = false, hasPanel = false, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // 动态刷新的状态
  const [cpuUsage, setCpuUsage] = useState(engine.cpuUsage);
  const [memoryUsage, setMemoryUsage] = useState(engine.memoryUsage);
  const [workerCount, setWorkerCount] = useState(engine.workerCount);
  const [taskCount, setTaskCount] = useState(engine.taskCount ?? 0);

  // CPU使用率 - 独立刷新
  useEffect(() => {
    const refreshCpu = () => {
      const newCpu = Math.floor(Math.random() * 40) + 40;
      setCpuUsage(newCpu);
    };

    const interval = setInterval(refreshCpu, getRandomInterval());
    // 首次延迟后立即执行一次
    const initialTimer = setTimeout(refreshCpu, 100);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  // 内存使用率 - 独立刷新
  useEffect(() => {
    const refreshMemory = () => {
      const newMemory = Math.floor(Math.random() * 40) + 40;
      setMemoryUsage(newMemory);
    };

    const interval = setInterval(refreshMemory, getRandomInterval());
    const initialTimer = setTimeout(refreshMemory, 100);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  // Worker数 - 独立刷新
  useEffect(() => {
    const refreshWorker = () => {
      const workerDelta = Math.floor(Math.random() * 5) - 2;
      const newWorker = Math.max(1, engine.workerCount + workerDelta);
      setWorkerCount(newWorker);
    };

    const interval = setInterval(refreshWorker, getRandomInterval());
    const initialTimer = setTimeout(refreshWorker, 100);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [engine.workerCount]);

  // 执行任务数 - 独立刷新
  useEffect(() => {
    if (engine.taskCount === undefined) return;

    const refreshTask = () => {
      const taskDelta = Math.floor(Math.random() * 11) - 5;
      const newTask = Math.max(0, engine.taskCount + taskDelta);
      setTaskCount(newTask);
    };

    const interval = setInterval(refreshTask, getRandomInterval());
    const initialTimer = setTimeout(refreshTask, 100);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [engine.taskCount]);

  // 转换引擎类型
  const engineType = ENGINE_TYPE_MAP[engine.engineType] || 'Trino';

  // 构建标签列表
  const tags = [
    engine.version,
    engine.businessMode,
    ...(engine.clusterType === 'cloud-native' ? ['云原生'] : []),
  ];

  // 构建引擎规模字符串
  const scaleString = `${engine.engineScale.spec} x ${engine.engineScale.count}`;

  // 是否显示 info 图标（仅 Trino 引擎且有 tooltip 时）
  const showInfoIcon = engine.engineType === 'trino' && engine.maxConcurrency.tooltip;

  return (
    <div className={styles.cardWrapper}>
      <div className={`${styles.card} ${isActive ? styles.cardActive : ''}`} onClick={onClick}>
        <div className={styles.cardHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.engineInfo}>
              <div className={styles.engineName}>
                <div className={styles.engineNameRow}>
                  <SlotLogo type={engineType} className={styles.engineLogo} />
                  <span className={styles.engineNameText}>{engine.displayName}</span>
                  <div className={styles.divider}></div>
                  <span className={styles.clusterName}>{engine.engineName}</span>
                  {engine.creationType === 'preset' && (
                    <div className={styles.presetTag}>
                      <Icon name="system-build" size={14} />
                      <span>预置</span>
                    </div>
                  )}
                </div>
                <div className={styles.tagsRow}>
                  {tags.map((tag, index) => (
                    <Tag key={index} text={tag} type="invalid" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {!hasPanel && (
          <div className={styles.headerRight}>
            {/* Flink引擎显示最大CU */}
            {engine.maxCU !== undefined && (
              <div className={styles.metric}>
                <span className={styles.metricLabel}>最大CU</span>
                <div className={styles.concurrencyValue}>
                  <span className={styles.metricValue}>{engine.maxCU}</span>
                </div>
              </div>
            )}
            {engine.maxConcurrency && (
              <div className={styles.metric}>
                <span className={styles.metricLabel}>最大并发</span>
                <div className={styles.concurrencyValue}>
                  <span className={styles.metricValue}>{engine.maxConcurrency.value}</span>
                  {showInfoIcon && (
                    <div
                      className={styles.infoIcon}
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <Icon name="info" size={14} />
                      {showTooltip && engine.maxConcurrency.tooltip && (
                        <div className={styles.tooltip}>
                          <div className={styles.tooltipContent}>
                            {engine.maxConcurrency.tooltip}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className={styles.metric}>
              <span className={styles.metricLabel}>引擎规模</span>
              <div className={styles.cuInfo}>
                <span className={styles.metricValue}>{scaleString}</span>
                <Tag text={engine.engineScale.type} type="invalid" />
              </div>
            </div>
          </div>
          )}
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.footerMetrics}>
            <div className={styles.metricGroup}>
              <div className={styles.usageMetric}>
                <span className={styles.usageLabel}>CPU</span>
                <div className={styles.usageProgress}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.progressBg}/>
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray={`${2 * Math.PI * 6 * (cpuUsage / 100)} ${2 * Math.PI * 6}`}
                      transform="rotate(-90 8 8)"
                      className={styles.progressFill}
                    />
                  </svg>
                  <AnimatedNumber value={cpuUsage} showPercent={true} />
                </div>
              </div>
              <div className={styles.usageMetric}>
                <span className={styles.usageLabel}>内存</span>
                <div className={styles.usageProgress}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.progressBg}/>
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray={`${2 * Math.PI * 6 * (memoryUsage / 100)} ${2 * Math.PI * 6}`}
                      transform="rotate(-90 8 8)"
                      className={styles.progressFill}
                    />
                  </svg>
                  <AnimatedNumber value={memoryUsage} showPercent={true} />
                </div>
              </div>
            </div>
            <div className={styles.metricGroup}>
              <div className={styles.workerMetric}>
                <span className={styles.workerLabel}>{engine.workerCountLabel || 'Worker数'}</span>
                <span className={styles.workerValue}>
                  <AnimatedNumber value={workerCount} showPercent={false} />
                </span>
              </div>
              {engine.taskCount !== undefined && (
                <div className={styles.taskMetric}>
                  <span className={styles.taskLabel}>执行任务数</span>
                  <span className={styles.taskValue}>
                    <AnimatedNumber value={taskCount} showPercent={false} />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 保留旧的 EngineInfo 类型用于向后兼容
export interface EngineInfo {
  id: string;
  name: string;
  type: 'Trino' | 'StarRocks' | 'Flink' | 'Hive';
  clusterName: string;
  isPreset: boolean;
  tags: string[];
  maxConcurrency: number;
  cuScale: string;
  cuType: string;
  cpuUsage: number;
  memoryUsage: number;
  workerCount: number;
  taskCount?: number;
}
