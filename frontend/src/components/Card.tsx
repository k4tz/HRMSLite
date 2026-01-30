import { type HTMLAttributes } from 'react'
import styles from './Card.module.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`${styles.card} ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}
