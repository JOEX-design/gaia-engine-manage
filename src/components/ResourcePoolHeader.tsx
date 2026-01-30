import React, { useState, useEffect, useRef } from 'react';
import styles from './ResourcePoolHeader.module.css';
import { Icon } from './Icon';
import { AnimatedNumber } from './AnimatedNumber';
import { ResourcePoolConfig } from '../types/engine';

interface ResourcePoolHeaderProps {
  pool: ResourcePoolConfig;
  engineCount?: number;
}

export const ResourcePoolHeader: React.FC<ResourcePoolHeaderProps> = ({ pool, engineCount }) => {
  const [showRunningCuInfo, setShowRunningCuInfo] = useState(false);
  const [showQueueInfo, setShowQueueInfo] = useState(false);

  // 动态刷新的状态
  const [runningCU, setRunningCU] = useState(pool.runningCUMetric.current);
  const [queueValue, setQueueValue] = useState(pool.queueMetric.current);

  // 使用ref保存当前值，避免依赖问题
  const runningCURef = useRef(runningCU);
  const queueValueRef = useRef(queueValue);

  // 同步ref和state
  useEffect(() => {
    runningCURef.current = runningCU;
  }, [runningCU]);

  useEffect(() => {
    queueValueRef.current = queueValue;
  }, [queueValue]);

  // 同时刷新CU数和队列 - 每4秒刷新一次
  useEffect(() => {
    const refreshMetrics = () => {
      // 刷新运行CU数
      const cuMax = pool.runningCUMetric.total;
      const cuMin = 0;
      const cuCurrent = runningCURef.current;
      const cuDelta = Math.floor(Math.random() * 10) - 5; // -5 到 +5 的变化
      const newCU = Math.max(cuMin, Math.min(cuMax, cuCurrent + cuDelta));

      // 刷新队列数
      const queueMax = pool.queueMetric.total;
      const queueMin = 0;
      const queueCurrent = queueValueRef.current;
      const queueDelta = Math.floor(Math.random() * 20) - 10; // -10 到 +10 的变化
      const newQueue = Math.max(queueMin, Math.min(queueMax, queueCurrent + queueDelta));

      setRunningCU(newCU);
      setQueueValue(newQueue);
    };

    // 4秒刷新一次
    const interval = setInterval(refreshMetrics, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [pool.runningCUMetric.total, pool.queueMetric.total]);

  // 计算进度条宽度百分比
  const getProgressWidth = (current: number, total: number) => {
    return `${(current / total) * 100}%`;
  };

  // 计算运行CU进度条宽度
  const runningCuWidth = getProgressWidth(runningCU, pool.runningCUMetric.total);

  // 计算队列进度条宽度
  const queueWidth = getProgressWidth(queueValue, pool.queueMetric.total);

  // 使用传入的引擎数量作为任务数，如果没有则使用配置中的值
  const taskCount = engineCount !== undefined ? engineCount : pool.taskMetric.current;

  // 生成任务数色块（有几个任务就有几个色块，所有色块都是活跃的）
  const taskSegments = Array.from({ length: taskCount }, () => ({
    isActive: true,
  }));

  return (
    <div className={styles.headerWrapper}>
      {/* Header 容器 - 带渐变背景 */}
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          {/* 左侧区域 */}
          <div className={styles.headerLeft}>
            {/* 第一行：图标 + 名称信息 */}
            <div className={styles.firstRow}>
              {/* 图标容器 */}
              <div className={styles.iconContainer}>
                <div className={styles.iconWrapper}>
                  <Icon name="space-line" size={18} />
                </div>
              </div>

              {/* 名称和信息区域 */}
              <div className={styles.nameContent}>
                <div className={styles.nameInner}>
                  {/* 名称和预置标签 */}
                  <div className={styles.nameLabelRow}>
                    <span className={styles.poolName}>{pool.displayName}</span>
                    <div className={styles.presetTag}>
                      <Icon name="system-build" size={14} />
                      <span>预置</span>
                    </div>
                  </div>
                  {/* 资源池代码 */}
                  <span className={styles.poolCode}>{pool.poolCode}</span>
                </div>
              </div>
            </div>

            {/* 第二行：状态和标签 */}
            <div className={styles.statusRow}>
              {/* 状态 */}
              <div className={`${styles.status} ${styles.statusEnabled}`}>
                <Icon name="dot" size={14} />
                <span>{pool.status.text}</span>
              </div>

              {/* 标签组 */}
              <div className={styles.tagsGroup}>
                {pool.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag.text}
                  </span>
                ))}
                {/* 创建者 */}
                <div className={styles.creator}>
                  <Icon name="user-1" size={14} />
                  <span>{pool.creator}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧区域 */}
          <div className={styles.headerRight}>
            <div className={styles.rightInner}>
              {/* 上方占位区域 - 把指标推到底部 */}
              <div className={styles.rightSpacer} />

              {/* 指标容器 */}
              <div className={styles.metricsContainer}>
                {/* 运行CU数 */}
                <div className={styles.metricItem}>
                  <div className={styles.metricContent}>
                    <div className={styles.metricHeader}>
                      <div className={styles.metricLabel}>
                        <span>运行CU数</span>
                        <div
                          className={styles.infoIcon}
                          onMouseEnter={() => setShowRunningCuInfo(true)}
                          onMouseLeave={() => setShowRunningCuInfo(false)}
                        >
                          <Icon name="info" size={14} />
                          {showRunningCuInfo && pool.runningCUMetric.infoTooltip && (
                            <div className={styles.tooltip}>
                              <div className={styles.tooltipContent}>
                                {pool.runningCUMetric.infoTooltip}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={styles.metricValue}>
                        <AnimatedNumber value={runningCU} showPercent={false} />/{pool.runningCUMetric.total}
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: runningCuWidth }} />
                    </div>
                  </div>
                </div>

                {/* 队列 */}
                <div className={styles.metricItem}>
                  <div className={styles.metricContent}>
                    <div className={styles.metricHeader}>
                      <div className={styles.metricLabel}>
                        <span>队列</span>
                        <div
                          className={styles.infoIcon}
                          onMouseEnter={() => setShowQueueInfo(true)}
                          onMouseLeave={() => setShowQueueInfo(false)}
                        >
                          <Icon name="info" size={14} />
                          {showQueueInfo && pool.queueMetric.infoTooltip && (
                            <div className={styles.tooltip}>
                              <div className={styles.tooltipContent}>
                                {pool.queueMetric.infoTooltip}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={styles.metricValue}>
                        <AnimatedNumber value={queueValue} showPercent={false} />/{pool.queueMetric.total}
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: queueWidth }} />
                    </div>
                  </div>
                </div>

                {/* 任务数 */}
                <div className={styles.metricItem}>
                  <div className={styles.metricContent}>
                    <div className={styles.metricHeader}>
                      <div className={styles.metricLabel}>
                        <span>任务数</span>
                      </div>
                      <span className={styles.metricValue}>{taskCount}</span>
                    </div>
                    <div className={styles.taskProgressBar}>
                      {taskSegments.map((segment, index) => (
                        <div
                          key={index}
                          className={segment.isActive ? styles.taskSegment : styles.taskSegmentInactive}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
