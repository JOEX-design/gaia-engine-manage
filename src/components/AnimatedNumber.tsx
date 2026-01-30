import React, { useState, useEffect, useRef } from 'react';
import styles from './AnimatedNumber.module.css';

interface AnimatedNumberProps {
  value: number;
  showPercent?: boolean;
}

// 数字滚动组件
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, showPercent = false }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    // 首次渲染时更新 ref，不播放动画
    prevValueRef.current = value;
  }, []);

  useEffect(() => {
    // 首次渲染后（value 不等于 ref 中的值）才更新并播放动画
    if (value !== prevValueRef.current) {
      setDisplayValue(value);
      prevValueRef.current = value;
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
