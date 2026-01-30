import React, { useState, useEffect } from 'react';
import styles from './EditChannelModal.module.css';
import { Icon } from './Icon';
import { ChannelConfig } from '../types/engine';

interface EditChannelModalProps {
  channel: ChannelConfig;
  visible: boolean;
  onSave: (updatedChannel: Partial<ChannelConfig>) => void;
  onCancel: () => void;
}

export const EditChannelModal: React.FC<EditChannelModalProps> = ({
  channel,
  visible,
  onSave,
  onCancel,
}) => {
  // 表单状态
  const [channelName, setChannelName] = useState(channel.channelName);
  const [maxQueue, setMaxQueue] = useState(channel.queueProgress.total);
  const [concurrencyRate, setConcurrencyRate] = useState(channel.concurrencyRate);
  const [queueTimeout, setQueueTimeout] = useState(() => {
    // 解析队列超时，如 "30s" -> 30
    const match = channel.queueTimeout.match(/(\d+)/);
    return match ? Number(match[1]) : 30;
  });
  const [queueTimeoutUnit, setQueueTimeoutUnit] = useState<'秒' | '分钟' | '小时'>('秒');

  // 初始化队列超时单位
  useEffect(() => {
    if (channel.queueTimeout.includes('min')) {
      setQueueTimeoutUnit('分钟');
    } else if (channel.queueTimeout.includes('h')) {
      setQueueTimeoutUnit('小时');
    } else {
      setQueueTimeoutUnit('秒');
    }
  }, [channel.queueTimeout]);

  // 处理保存
  const handleSave = () => {
    const updatedChannel: Partial<ChannelConfig> = {
      channelName,
      queueProgress: {
        ...channel.queueProgress,
        total: maxQueue,
      },
      concurrencyRate,
      queueTimeout: `${queueTimeout}${queueTimeoutUnit === '分钟' ? 'min' : queueTimeoutUnit === '小时' ? 'h' : 's'}`,
    };
    onSave(updatedChannel);
  };

  // 处理取消
  const handleCancel = () => {
    // 重置表单
    setChannelName(channel.channelName);
    setMaxQueue(channel.queueProgress.total);
    setConcurrencyRate(channel.concurrencyRate);
    onCancel();
  };

  if (!visible) return null;

  return (
    <div className={styles.mask}>
      <div className={styles.modal}>
        {/* 标题栏 */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.title}>编辑通道</p>
          </div>
          <button className={styles.closeButton} onClick={handleCancel}>
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* 内容区 */}
        <div className={styles.content}>
          {/* 通道显示名 */}
          <div className={styles.formItem}>
            <div className={styles.label}>
              <p>通道显示名</p>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="请输入"
                maxLength={48}
              />
            </div>
          </div>

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

          {/* 并发系数 和 队列超时 - 并排显示 */}
          <div className={styles.formRow}>
            {/* 并发系数 */}
            <div className={styles.formItem}>
              <div className={styles.label}>
                <p>并发系数</p>
              </div>
              <div className={styles.inputWithSuffix}>
                <input
                  type="number"
                  className={styles.input}
                  value={concurrencyRate}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0 && value <= 100) {
                      setConcurrencyRate(value);
                    }
                  }}
                  placeholder="请输入"
                  min={0}
                  max={100}
                />
                <div className={styles.suffix}>
                  <span>%</span>
                </div>
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
