/**
 * 引擎配置文件加载器
 * 使用 Vite 的 JSON 导入功能
 */

import { EngineConfig, ResourcePoolConfig } from '../types/engine';

// 直接导入引擎配置文件
import defaultEngineConfig from './engines/default-engine.json';
import dwBatchEngineConfig from './engines/dw-batch-engine.json';
import starrocksEngineConfig from './engines/starrocks-engine.json';
import flinkSessionEnginesConfig from './engines/flink-session-engines.json';
import flinkResourcePoolEnginesConfig from './engines/flink-resource-pool-engines.json';

// 导入资源池配置文件
import flinkRealtimePoolsConfig from './pools/flink-realtime-pools.json';
import flinkBatchPoolsConfig from './pools/flink-batch-pools.json';

/**
 * 获取所有引擎配置
 */
export function loadEngineConfigs(): EngineConfig[] {
  const configs = [
    defaultEngineConfig,
    dwBatchEngineConfig,
    starrocksEngineConfig,
    flinkSessionEnginesConfig,
    flinkResourcePoolEnginesConfig,
  ];

  // 合并所有引擎配置，添加类型断言
  return configs.flatMap((config) => config.engines as EngineConfig[]);
}

/**
 * 根据引擎类型获取引擎配置
 */
export function getEnginesByType(engineType: string): EngineConfig[] {
  const allEngines = loadEngineConfigs();
  return allEngines.filter((engine) => engine.engineType === engineType);
}

/**
 * 根据 ID 获取单个引擎配置
 */
export function getEngineById(id: string): EngineConfig | undefined {
  const allEngines = loadEngineConfigs();
  return allEngines.find((engine) => engine.id === id);
}

/**
 * 获取所有引擎类型（用于 Tab）
 */
export function getEngineTypes(): string[] {
  const allEngines = loadEngineConfigs();
  const types = new Set(allEngines.map(engine => engine.engineType));
  return Array.from(types);
}

/**
 * 加载实时任务资源池配置
 */
export function loadRealtimeResourcePools(): ResourcePoolConfig[] {
  return flinkRealtimePoolsConfig.pools as ResourcePoolConfig[];
}

/**
 * 加载离线集成资源池配置
 */
export function loadBatchResourcePools(): ResourcePoolConfig[] {
  return flinkBatchPoolsConfig.pools as ResourcePoolConfig[];
}

/**
 * 根据资源池类型获取资源池配置
 */
export function getResourcePoolsByType(poolType: 'realtime' | 'batch'): ResourcePoolConfig[] {
  if (poolType === 'realtime') {
    return loadRealtimeResourcePools();
  }
  return loadBatchResourcePools();
}

/**
 * 根据 ID 获取单个资源池配置
 */
export function getResourcePoolById(id: string): ResourcePoolConfig | undefined {
  const realtimePools = loadRealtimeResourcePools();
  const batchPools = loadBatchResourcePools();
  return [...realtimePools, ...batchPools].find(pool => pool.id === id);
}
