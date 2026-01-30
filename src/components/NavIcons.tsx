import React from 'react';

// 菜单图标 - 顶部导航栏使用
export const MenuIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M2.5 5H17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M2.5 10H17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M2.5 15H17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// CPU 图标 - 计算引擎
export const CpuIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="3.5"
      y="3.5"
      width="11"
      height="11"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M6.5 1.5V3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M11.5 1.5V3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M6.5 14.5V16.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M11.5 14.5V16.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M1.5 6.5H3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M1.5 11.5H3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14.5 6.5H16.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14.5 11.5H16.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Server 图标 - 存储资源
export const ServerIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="2.5"
      y="2.5"
      width="13"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="2.5"
      y="10.5"
      width="13"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="4.5" cy="5" r="0.5" fill="currentColor" />
    <circle cx="6.5" cy="5" r="0.5" fill="currentColor" />
    <circle cx="4.5" cy="13" r="0.5" fill="currentColor" />
    <circle cx="6.5" cy="13" r="0.5" fill="currentColor" />
  </svg>
);

// Shield Keyhole 图标 - 数据权限
export const ShieldIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9 1.5L3 3.5V8.5C3 12.5 5.5 16 9 17C12.5 16 15 12.5 15 8.5V3.5L9 1.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="9"
      cy="9"
      r="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M9 11V13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// 时钟图标
export const ClockIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 5V10H13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 星星图标
export const StarIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10 2L12.5 7.5H18L13.5 11L15 17L10 13.5L5 17L6.5 11L2 7.5H7.5L10 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 通知图标
export const NotificationIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10 3C7.24 3 5 5.24 5 8V11C5 11.94 4.62 12.82 4.06 13.5C3.5 14.18 3.5 15 3.5 15H16.5C16.5 15 16.5 14.18 15.94 13.5C15.38 12.82 15 11.94 15 11V8C15 5.24 12.76 3 10 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 15C8 16.1 8.9 17 10 17C11.1 17 12 16.1 12 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 下拉箭头图标
export const ArrowDownIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5 8L10 13L15 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
