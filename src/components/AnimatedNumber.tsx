import React, { useState, useEffect, useRef } from 'react';
import styles from './AnimatedNumber.module.css';

interface AnimatedNumberProps {
  value: number;
  showPercent?: boolean;
}

// 数字滚动组件
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, showPercent = false }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!hasAnimated.current) {
      // 首次渲染时，延迟一小段时间后滚动到目标值
      const timer = setTimeout(() => {
        setDisplayValue(value);
        hasAnimated.current = true;
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // 后续更新直接设置值
      setDisplayValue(value);
    }
  }, [value]);

  // 将数字转换为字符串，每个数字位独立滚动
  const valueStr = displayValue.toString().padStart(value.toString().length, '0');

  return (
    <span className={styles.animatedNumber}>
      {valueStr.split('').map((digit, index) => {
        const digitValue = parseInt(digit);
        const digitStyle = { '--digit-pos': digitValue } as React.CSSProperties;

        return (
          <span key={index} className={styles.digitColumn}>
            <span className={styles.digitStrip} style={digitStyle} data-digit={digitValue}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <span key={num} className={styles.digit}>{num}</span>
              ))}
            </span>
          </span>
        );
      })}
      {showPercent && <span className={styles.percentSymbol}>%</span>}
    </span>
  );
};
