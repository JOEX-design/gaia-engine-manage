/**
 * 引擎配置文件加载器
 * 使用 Vite 的 JSON 导入功能
 */

import { EngineConfig } from '../types/engine';

// 直接导入配置文件
import defaultEngineConfig from './engines/default-engine.json';
import dwBatchEngineConfig from './engines/dw-batch-engine.json';
import starrocksEngineConfig from './engines/starrocks-engine.json';
import flinkSessionEnginesConfig from './engines/flink-session-engines.json';

/**
 * 获取所有引擎配置
 */
export function loadEngineConfigs(): EngineConfig[] {
  const configs = [
    defaultEngineConfig,
    dwBatchEngineConfig,
    starrocksEngineConfig,
    flinkSessionEnginesConfig,
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
