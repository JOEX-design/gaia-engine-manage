import React, { useState, useEffect } from 'react';
import styles from './EditEngineModal.module.css';
import { Icon } from './Icon';
import { EngineConfig } from '../types/engine';

interface EditEngineModalProps {
  engine: EngineConfig;
  visible: boolean;
  onSave: (updatedEngine: Partial<EngineConfig>) => void;
  onCancel: () => void;
}

// 判断是否为Flink Session引擎
const isFlinkSession = (engine: EngineConfig) => {
  return engine.engineType === 'flink' && engine.flinkSubType === 'session';
};

// 判断是否为资源池引擎
const isResourcePoolEngine = (engine: EngineConfig) => {
  return engine.engineType === 'flink' &&
    (engine.flinkSubType === 'resource-pool-realtime' || engine.flinkSubType === 'resource-pool-batch');
};

export const EditEngineModal: React.FC<EditEngineModalProps> = ({
  engine,
  visible,
  onSave,
  onCancel,
}) => {
  // 表单状态
  const [displayName, setDisplayName] = useState(engine.displayName);
  const [maxConcurrency, setMaxConcurrency] = useState(engine.maxConcurrency?.value ?? 0);
  const [minWorker, setMinWorker] = useState(1);
  const [maxWorker, setMaxWorker] = useState(6);
  const [sliderValue, setSliderValue] = useState<[number, number]>([1, 6]);

  // Flink Session 特有字段
  const [minWarmup, setMinWarmup] = useState('');
  const [maxQueue, setMaxQueue] = useState(100);
  const [queueTimeout, setQueueTimeout] = useState(4);
  const [queueTimeoutUnit] = useState<'秒' | '分钟' | '小时'>('秒');

  // 从引擎规模中解析Worker数量
  useEffect(() => {
    const countStr = engine.engineScale.count;
    // 检查是否是范围（支持半角~和全角～）
    if (countStr.includes('~') || countStr.includes('～')) {
      // 使用全角或半角波浪号分割
      const separator = countStr.includes('～') ? '～' : '~';
      const [min, max] = countStr.split(separator).map(Number);
      setMinWorker(min);
      setMaxWorker(max);
      setSliderValue([min, max]);
    } else {
      // 单个数值
      const count = Number(countStr);
      setMinWorker(count);
      setMaxWorker(count);
      setSliderValue([count, count]);
    }
  }, [engine.engineScale.count]);

  // 初始化Flink Session特有字段
  useEffect(() => {
    if (isFlinkSession(engine)) {
      // 解析 minWarmup，如 "2CU" -> "2"
      if (engine.minWarmup) {
        const match = engine.minWarmup.match(/(\d+)/);
        setMinWarmup(match ? match[1] : '');
      }
    }
  }, [engine]);

  // 根据引擎类型确定单位名称
  const getUnitName = () => {
    if (engine.engineType === 'starrocks') {
      return 'CN';
    }
    if (engine.engineType === 'flink') {
      return 'TM';
    }
    if (engine.engineType === 'automq') {
      return '实例';
    }
    return 'Worker';
  };

  // 处理滑块变化
  const handleSliderChange = (values: [number, number]) => {
    setSliderValue(values);
    setMinWorker(values[0]);
    setMaxWorker(values[1]);
  };

  // 处理保存
  const handleSave = () => {
    const updatedEngine: Partial<EngineConfig> = {
      displayName,
    };

    // 只有存在 maxConcurrency 时才更新
    if (engine.maxConcurrency) {
      updatedEngine.maxConcurrency = {
        value: maxConcurrency,
      };
    }

    // Flink Session 特有字段
    if (isFlinkSession(engine)) {
      if (minWarmup) {
        updatedEngine.minWarmup = `${minWarmup}CU`;
      }
    }

    // 只有云原生集群才更新弹性伸缩区间
    if (engine.clusterType === 'cloud-native') {
      updatedEngine.engineScale = {
        ...engine.engineScale,
        count: minWorker === maxWorker ? `${minWorker}` : `${minWorker}~${maxWorker}`,
      };
      updatedEngine.workerCount = maxWorker;
    }

    onSave(updatedEngine);
  };

  // 处理取消
  const handleCancel = () => {
    // 重置表单
    setDisplayName(engine.displayName);
    setMaxConcurrency(engine.maxConcurrency?.value ?? 0);
    onCancel();
  };

  if (!visible) return null;

  return (
    <div className={styles.mask}>
      <div className={styles.modal} data-node-id="81-9095">
        {/* 标题栏 */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.title}>编辑引擎</p>
          </div>
          <button className={styles.closeButton} onClick={handleCancel}>
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* 内容区 */}
        <div className={styles.content}>
          {/* 引擎显示名 - 资源池引擎不显示 */}
          {!isResourcePoolEngine(engine) && (
            <div className={styles.formItem}>
              <div className={styles.label}>
                <p>引擎显示名</p>
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
          )}

          {/* Flink Session 特有字段 */}
          {isFlinkSession(engine) && (
            <>
              {/* 最小预热CU */}
              <div className={styles.formItem}>
                <div className={styles.label}>
                  <p>最小预热CU</p>
                </div>
                <div className={styles.inputWrapper}>
                  <input
                    type="number"
                    className={styles.input}
                    value={minWarmup}
                    onChange={(e) => setMinWarmup(e.target.value)}
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
            </>
          )}

          {/* 最大并发数 - 仅当引擎有此字段且不是Flink Session时显示 */}
          {engine.maxConcurrency && !isFlinkSession(engine) && (
            <div className={styles.formItem}>
              <div className={styles.label}>
                <p>最大并发数</p>
              </div>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                className={styles.input}
                value={maxConcurrency}
                onChange={(e) => setMaxConcurrency(Number(e.target.value))}
                placeholder="请输入"
                min={1}
              />
            </div>
          </div>
          )}

          {/* 弹性伸缩区间 - 仅云原生集群显示 */}
          {engine.clusterType === 'cloud-native' && (
            <div className={styles.formItem}>
              <div className={styles.label}>
                <p>弹性伸缩区间</p>
              </div>
            <div className={styles.sliderContainer}>
              {/* 滑块 */}
              <div className={styles.sliderWrapper}>
                <div className={styles.slider}>
                  <div
                    className={styles.sliderTrack}
                    style={{
                      left: `${((sliderValue[0] - 1) / 11) * 100}%`,
                      right: `${100 - ((sliderValue[1] - 1) / 11) * 100}%`,
                    }}
                  ></div>
                  <input
                    type="range"
                    className={styles.sliderInput}
                    min={1}
                    max={12}
                    value={sliderValue[0]}
                    onChange={(e) => {
                      const newMin = Number(e.target.value);
                      if (newMin <= sliderValue[1]) {
                        handleSliderChange([newMin, sliderValue[1]]);
                      }
                    }}
                  />
                  <input
                    type="range"
                    className={styles.sliderInput}
                    min={1}
                    max={12}
                    value={sliderValue[1]}
                    onChange={(e) => {
                      const newMax = Number(e.target.value);
                      if (newMax >= sliderValue[0]) {
                        handleSliderChange([sliderValue[0], newMax]);
                      }
                    }}
                  />
                </div>
              </div>

              {/* 输入框组 */}
              <div className={styles.inputGroup}>
                <div className={styles.inputWithSelect}>
                  <input
                    type="number"
                    className={styles.input}
                    value={minWorker}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 1 && value <= 12 && value <= maxWorker) {
                        handleSliderChange([value, maxWorker]);
                      }
                    }}
                    min={1}
                    max={12}
                  />
                  <div className={styles.select}>
                    <span>{getUnitName()}</span>
                  </div>
                </div>
                <span className={styles.separator}>～</span>
                <div className={styles.inputWithSelect}>
                  <input
                    type="number"
                    className={styles.input}
                    value={maxWorker}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 1 && value <= 12 && value >= minWorker) {
                        handleSliderChange([minWorker, value]);
                      }
                    }}
                    min={1}
                    max={12}
                  />
                  <div className={styles.select}>
                    <span>{getUnitName()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
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
