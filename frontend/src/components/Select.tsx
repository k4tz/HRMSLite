import { type SelectHTMLAttributes, forwardRef } from 'react'
import styles from './Input.module.css'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, className = '', ...props }, ref) => {
    const inputId = id ?? label.replace(/\s+/g, '-').toLowerCase()
    return (
      <div className={styles.field}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <select
          ref={ref}
          id={inputId}
          className={`${styles.input} ${error ? styles.hasError : ''} ${className}`.trim()}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'
