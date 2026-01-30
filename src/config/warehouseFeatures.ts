export interface WarehouseFeature {
  id: string;
  name: string;
  enabled: boolean;
  enabledSpaces?: string[];
  availableApp?: string;
}

// 初始特性配置
export const initialFeatures: Record<string, WarehouseFeature> = {
  'realtime-task': {
    id: 'realtime-task',
    name: '实时任务',
    enabled: false,
    enabledSpaces: ['Default', '数开空间1', '数开空间2'],
    availableApp: '数据开发平台',
  },
  'warmup-batch-integration': {
    id: 'warmup-batch-integration',
    name: '预热式批量集成',
    enabled: false,
  },
};

// 判断引擎是否应该被显示
// 基于引擎的 businessMode 和其他属性
export function shouldEngineBeVisible(
  engine: {
    engineType: string;
    businessMode?: string;
    flinkSubType?: string;
    resourcePoolId?: string;
  },
  features: Record<string, WarehouseFeature>
): boolean {
  const realtimeTaskFeature = features['realtime-task'];
  const warmupBatchFeature = features['warmup-batch-integration'];

  // "实时任务"特性控制：
  // 1. Flink Session 引擎中 businessMode 为 "流式计算" 的引擎
  // 2. AutoMQ 引擎（businessMode 为 "流式存储"）
  // 3. Flink 实时资源池中 resourcePoolId 包含 "realtime-dw-task" 的引擎
  if (engine.engineType === 'flink' && engine.flinkSubType === 'session') {
    if (engine.businessMode === '流式计算') {
      return realtimeTaskFeature.enabled;
    }
    if (engine.businessMode === '预热式批量集成') {
      return warmupBatchFeature.enabled;
    }
  }

  // AutoMQ 引擎由"实时任务"特性控制
  if (engine.engineType === 'automq') {
    return realtimeTaskFeature.enabled;
  }

  // Flink 资源池引擎
  if (engine.engineType === 'flink' && engine.flinkSubType === 'resource-pool-realtime') {
    // "实时任务"资源池由"实时任务"特性控制
    if (engine.resourcePoolId?.includes('realtime-dw-task')) {
      return realtimeTaskFeature.enabled;
    }
  }

  // 离线集成资源池引擎不受特性控制，始终显示

  // 其他引擎不受特性控制
  return true;
}

// 判断资源池是否应该被禁用
export function isResourcePoolDisabled(
  resourcePoolId: string,
  features: Record<string, WarehouseFeature>
): boolean {
  const realtimeTaskFeature = features['realtime-task'];

  // "实时任务"资源池由"实时任务"特性控制
  if (resourcePoolId.includes('realtime-dw-task')) {
    return !realtimeTaskFeature.enabled;
  }

  // "离线集成"资源池不受任何特性控制，始终可用
  // 其他资源池也不受控制
  return false;
}
