import { useState, useRef } from 'react';
import styles from './Search.module.css';
import { Icon } from './Icon';

interface SearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export const Search: React.FC<SearchProps> = ({
  placeholder = '搜索',
  value = '',
  onChange,
  onClear,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // 受控模式：使用外部 value
  // 非受控模式：使用内部 state
  const inputValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <div className={styles.searchWrapper}>
        <Icon name="search" size={14} color="#8f9094" className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        {inputValue && (
          <button
            className={styles.clearButton}
            onClick={handleClear}
            type="button"
            aria-label="清除"
          >
            <Icon name="close" size={12} color="#8f9094" />
          </button>
        )}
      </div>
    </div>
  );
};
