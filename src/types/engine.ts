/**
 * 引擎配置文件类型定义
 * 根据 Figma 设计稿字段映射创建
 */

// 引擎类型
export type EngineType = 'trino' | 'starrocks' | 'flink' | 'hive';

// Flink 引擎子类型
export type FlinkEngineSubType = 'session' | 'resource-pool-realtime' | 'resource-pool-batch';

// 创建方式
export type CreationType = 'preset' | 'custom';

// 集群类型
export type ClusterType = 'normal' | 'cloud-native';

// CU 规格类型
export type CUType = '计算型' | '内存型' | '存储型' | '通用型';

// 通道状态
export type ChannelStatus = 'enabled' | 'disabled';

/**
 * 引擎标签配置
 */
export interface EngineTag {
  /** 标签文本 */
  text: string;
  /** 标签类型 */
  type?: 'default' | 'invalid';
  /** 是否有图标 */
  hasIcon?: boolean;
  /** 图标名称（当 hasIcon 为 true 时） */
  iconName?: string;
}

/**
 * 进度条配置
 */
export interface ProgressConfig {
  /** 当前值 */
  current: number;
  /** 总值 */
  total: number;
}

/**
 * 通道配置接口
 */
export interface ChannelConfig {
  /** 通道ID（唯一标识） */
  id: string;
  /** 通道名称 */
  channelName: string;
  /** 通道代码 */
  channelCode: string;
  /** 是否预置 */
  isPreset: boolean;
  /** 可用应用 */
  availableApp: string;
  /** 业务模式 */
  businessMode: string;
  /** 队列超时 */
  queueTimeout: string;
  /** 创建者 */
  creator: string;
  /** 状态 */
  status: ChannelStatus;
  /** 队列进度 */
  queueProgress: ProgressConfig;
  /** 并发系数（0-100） */
  concurrencyRate: number;
}

/**
 * 引擎配置接口
 */
export interface EngineConfig {
  /** 2.1 引擎类型 */
  engineType: EngineType;

  /** Flink 引擎子类型（仅Flink引擎需要） */
  flinkSubType?: FlinkEngineSubType;

  /** 2.2 引擎显示名 (Max 48个字符) */
  displayName: string;

  /** 2.3 引擎名 */
  engineName: string;

  /** 2.4 创建方式（非预置时，不展示标签） */
  creationType: CreationType;

  /** 2.5 引擎版本 */
  version: string;

  /** 2.6 业务模式 */
  businessMode: string;

  /** 2.7 集群类型（普通集群不展示标签） */
  clusterType: ClusterType;

  /** 2.8 CPU平均使用率（环形进度条 数值%） */
  cpuUsage: number;

  /** 2.9 内存平均使用率（环形进度条 数值%） */
  memoryUsage: number;

  /** 2.10 最大并发（Trino数值后有info tooltip） */
  maxConcurrency: {
    /** 并发数值 */
    value: number;
    /** Tooltip 内容（可选） */
    tooltip?: string;
  };

  /** Flink引擎最大CU（仅Flink引擎需要） */
  maxCU?: number;

  /** Flink Session 型引擎最大运行CU数 */
  maxRunningCU?: number;

  /** Flink Session 型引擎 JM 规格 */
  jmSpec?: string;

  /** Flink Session 型引擎 TM 规格 */
  tmSpec?: string;

  /** Flink Session 型引擎每并行CU */
  parallelCU?: string;

  /** Flink Session 型引擎最小预热 */
  minWarmup?: string;

  /** 2.11 引擎规模（节点规格 x 数量 规格类型） */
  engineScale: {
    /** 节点规格，如 "4CU" */
    spec: string;
    /** 数量，可以是单值或范围，如 "4" 或 "4~8" */
    count: string;
    /** 规格类型 */
    type: CUType;
  };

  /** 2.12 Worker数（StarRocks为CN数） */
  workerCount: number;

  /** 节点数量显示标签（可选，默认为"Worker数"，StarRocks可设置为"CN数"） */
  workerCountLabel?: string;

  /** 2.13 执行任务数 */
  taskCount: number;

  /** Coordinator规格 */
  coordinatorSpec: string;

  /** Worker规格 */
  workerSpec: string;

  /** 创建者 */
  creator: string;

  /** 通道列表（可选，引擎可能没有通道） */
  channels?: ChannelConfig[];

  /** 指标列表 */
  metrics: MetricConfig[];

  /** 引擎ID（唯一标识） */
  id: string;
}

/**
 * 指标配置接口
 */
export interface MetricConfig {
  /** 指标ID */
  id: string;
  /** 指标名称 */
  name: string;
  /** 指标值 */
  value: number | string;
  /** 单位 */
  unit?: string;
  /** 是否高亮显示（蓝色边框） */
  highlight?: boolean;
  /** 图表数据（可选，用于绘制折线图） */
  chartData?: number[];
}

/**
 * 配置文件结构
 */
export interface EnginesConfigFile {
  /** 配置文件版本 */
  version: string;
  /** 引擎列表 */
  engines: EngineConfig[];
}
