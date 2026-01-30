import React, { useState } from 'react';
import styles from './EditResourcePoolModal.module.css';
import { Icon } from './Icon';
import { ResourcePoolConfig } from '../types/engine';

interface EditResourcePoolModalProps {
  pool: ResourcePoolConfig;
  visible: boolean;
  onSave: (updatedPool: Partial<ResourcePoolConfig>) => void;
  onCancel: () => void;
}

export const EditResourcePoolModal: React.FC<EditResourcePoolModalProps> = ({
  pool,
  visible,
  onSave,
  onCancel,
}) => {
  // 表单状态
  const [displayName, setDisplayName] = useState(pool.displayName);
  const [maxRunningCU, setMaxRunningCU] = useState(pool.runningCUMetric.total);
  const [maxQueue, setMaxQueue] = useState(pool.queueMetric.total);
  const [queueTimeout, setQueueTimeout] = useState(() => {
    // 解析队列超时，如 "30s" -> 30
    const match = pool.queueMetric.current.toString().match(/(\d+)/);
    return match ? Number(match[1]) : 30;
  });
  const queueTimeoutUnit: '秒' | '分钟' | '小时' = '秒';

  // 处理保存
  const handleSave = () => {
    const updatedPool: Partial<ResourcePoolConfig> = {
      displayName,
      runningCUMetric: {
        ...pool.runningCUMetric,
        total: maxRunningCU,
      },
      queueMetric: {
        ...pool.queueMetric,
        total: maxQueue,
      },
    };
    onSave(updatedPool);
  };

  // 处理取消
  const handleCancel = () => {
    // 重置表单
    setDisplayName(pool.displayName);
    setMaxRunningCU(pool.runningCUMetric.total);
    setMaxQueue(pool.queueMetric.total);
    onCancel();
  };

  if (!visible) return null;

  return (
    <div className={styles.mask}>
      <div className={styles.modal}>
        {/* 标题栏 */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.title}>编辑资源池</p>
          </div>
          <button className={styles.closeButton} onClick={handleCancel}>
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* 内容区 */}
        <div className={styles.content}>
          {/* 资源池显示名 */}
          <div className={styles.formItem}>
            <div className={styles.label}>
              <p>资源池显示名</p>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="请输入"
                maxLength={48}
              />
            </div>
          </div>

          {/* 最大运行CU数 */}
          <div className={styles.formItem}>
            <div className={styles.label}>
              <p>最大运行CU数</p>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                className={styles.input}
                value={maxRunningCU}
                onChange={(e) => setMaxRunningCU(Number(e.target.value))}
                placeholder="请输入"
                min={1}
              />
            </div>
          </div>

          {/* 最大队列和队列超时 - 并排显示 */}
          <div className={styles.formRow}>
            {/* 最大队列 */}
            <div className={styles.formItem}>
              <div className={styles.label}>
                <p>最大队列</p>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  className={styles.input}
                  value={maxQueue}
                  onChange={(e) => setMaxQueue(Number(e.target.value))}
                  placeholder="请输入"
                  min={1}
                />
              </div>
            </div>

            {/* 队列超时 */}
            <div className={styles.formItem}>
              <div className={styles.label}>
                <p>队列超时</p>
              </div>
              <div className={styles.inputWithSelectWrapper}>
                <input
                  type="number"
                  className={styles.input}
                  value={queueTimeout}
                  onChange={(e) => setQueueTimeout(Number(e.target.value))}
                  placeholder="请输入"
                  min={1}
                />
                <div className={styles.select}>
                  <span>{queueTimeoutUnit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className={styles.footer}>
          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={handleCancel}>
              取消
            </button>
            <button className={styles.saveButton} onClick={handleSave}>
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
