import React, { useState, useEffect } from 'react';
import styles from './AutoMQCard.module.css';
import { SlotLogo } from './SlotLogo';
import { Tag } from './Tag';
import { Icon } from './Icon';
import { AnimatedNumber } from './AnimatedNumber';

interface AutoMQCardProps {
  engine: {
    id: string;
    displayName: string;
    engineName: string;
    creationType: 'preset' | 'custom';
    version: string;
    businessMode: string;
    clusterType: 'normal' | 'cloud-native';
    cpuUsage: number;
    memoryUsage: number;
    engineScale: {
      spec: string;
      count: string;
      type: string;
    };
    workerCount: number;
    workerCountLabel?: string;
  };
  onClick?: () => void;
  isActive?: boolean;
}

// 生成随机刷新间隔（4、8、12秒）
const getRandomInterval = () => {
  const intervals = [4000, 8000, 12000];
  return intervals[Math.floor(Math.random() * intervals.length)];
};

export const AutoMQCard: React.FC<AutoMQCardProps> = ({ engine, onClick, isActive = false }) => {
  // 动态刷新的状态
  const [cpuUsage, setCpuUsage] = useState(engine.cpuUsage);
  const [memoryUsage, setMemoryUsage] = useState(engine.memoryUsage);
  const [controllerCount, setControllerCount] = useState(engine.workerCount);

  // CPU使用率 - 独立刷新
  useEffect(() => {
    const refreshCpu = () => {
      const newCpu = Math.floor(Math.random() * 40) + 40;
      setCpuUsage(newCpu);
    };

    const interval = setInterval(refreshCpu, getRandomInterval());
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

  // Controller数 - 独立刷新
  useEffect(() => {
    const refreshController = () => {
      const controllerDelta = Math.floor(Math.random() * 5) - 2;
      const newController = Math.max(1, engine.workerCount + controllerDelta);
      setControllerCount(newController);
    };

    const interval = setInterval(refreshController, getRandomInterval());
    const initialTimer = setTimeout(refreshController, 100);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [engine.workerCount]);

  // 构建标签列表
  const tags = [
    engine.version,
    engine.businessMode,
    ...(engine.clusterType === 'cloud-native' ? ['云原生'] : []),
  ];

  // 构建引擎规模字符串
  const scaleString = `${engine.engineScale.spec} x ${engine.engineScale.count}`;

  return (
    <div className={styles.cardWrapper} onClick={onClick}>
      <div className={`${styles.card} ${isActive ? styles.cardActive : ''}`}>
        <div className={styles.cardHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.engineInfo}>
              <div className={styles.engineNameRow}>
                <SlotLogo type="AutoMQ" className={styles.engineLogo} />
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
          <div className={styles.headerRight}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>引擎规模</span>
              <div className={styles.cuInfo}>
                <span className={styles.metricValue}>{scaleString}</span>
                <Tag text={engine.engineScale.type} type="invalid" />
              </div>
            </div>
          </div>
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
              <div className={styles.controllerMetric}>
                <span className={styles.controllerLabel}>{engine.workerCountLabel || 'Controller数'}</span>
                <span className={styles.controllerValue}>
                  <AnimatedNumber value={controllerCount} showPercent={false} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
