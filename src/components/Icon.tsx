import React from 'react';
import * as TaIcons from '@tant/icons';

// Icon 类型定义
type IconName =
  // 导航相关
  | 'menu-fold' | 'menu-unfold' | 'grid'
  // 功能相关
  | 'cpu' | 'server' | 'shield-keyhole' | 'warehouse'
  // 箭头相关
  | 'arrow-down' | 'arrow-left' | 'arrow-right' | 'arrow-up'
  | 'chevron-down' | 'chevron-left' | 'chevron-right' | 'chevron-up'
  | 'd-arrow-r'  // 双箭头右
  // 操作相关
  | 'search' | 'filter' | 'setting' | 'speed' | 'close' | 'bell' | 'edit' | 'recurring'
  // 状态相关
  | 'star' | 'star-fill' | 'check' | 'dot' | 'clock'
  // 引擎 Logo
  | 'logo-trino' | 'logo-starrocks' | 'logo-flink' | 'logo-hive'
  | 'logo-spark' | 'logo-kafka'
  // 其他
  | 'system-build' | 'help' | 'notification' | 'info'
  | 'logo-feishu' | 'logo-dingding' | 'logo-wecom'
  | 'space-line'  // 资源池分隔线图标
  | 'dashboard-plan';  // 引擎图标

interface IconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Icon 名称映射到 @tant/icons 的组件名称
const iconMap: Record<IconName, keyof typeof TaIcons> = {
  'menu-fold': 'TaMenuFold',
  'menu-unfold': 'TaMenuUnfold',
  'grid': 'TaGrid',
  'cpu': 'TaCpu',
  'server': 'TaServer',
  'shield-keyhole': 'TaShieldKeyhole',
  'warehouse': 'TaWarehouse',
  'arrow-down': 'TaArrowDown',
  'arrow-left': 'TaArrowLeft',
  'arrow-right': 'TaArrowRight',
  'arrow-up': 'TaArrowUp',
  'chevron-down': 'TaArrowDown',
  'chevron-left': 'TaArrowLeft',
  'chevron-right': 'TaArrowRight',
  'chevron-up': 'TaArrowUp',
  'd-arrow-r': 'TaDArrowR',
  'search': 'TaSearch',
  'filter': 'TaFilter',
  'setting': 'TaSetting',
  'speed': 'TaSpeed',
  'close': 'TaArrowClose',
  'bell': 'TaBell',
  'edit': 'TaEdit',
  'recurring': 'TaRecurring',
  'star': 'TaLogoStarrocksCl',
  'star-fill': 'TaLogoStarrocksCl',
  'check': 'TaShieldCheck',
  'dot': 'TaDot',
  'clock': 'TaTimeSm',
  'logo-trino': 'TaCpu',
  'logo-starrocks': 'TaLogoStarrocksCl',
  'logo-flink': 'TaPlanetCl',
  'logo-hive': 'TaFolderOpenLine',
  'logo-spark': 'TaPlanetCl',
  'logo-kafka': 'TaMEventCl',
  'system-build': 'TaSystemBuild',
  'help': 'TaTimeLock',
  'notification': 'TaAlertCl',
  'info': 'TaInfo',
  'logo-feishu': 'TaLogoFeishuCl',
  'logo-dingding': 'TaLogoDingdingCl',
  'logo-wecom': 'TaLogoWecomCl',
  'space-line': 'TaSpaceLine',
  'dashboard-plan': 'TaDashboardPlan',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 16,
  color,
  className = '',
  style,
}) => {
  const iconName = iconMap[name];
  const IconComponent = TaIcons[iconName] as React.FC<{
    size?: number | string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
  }>;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in @tant/icons`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      className={className}
      style={style}
    />
  );
};
