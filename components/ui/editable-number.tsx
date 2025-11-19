'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface EditableNumberProps {
  value: number
  onSave: (value: number) => void
  className?: string
  formatOptions?: Intl.NumberFormatOptions
  allowNegative?: boolean
  min?: number
  max?: number
  step?: number
}

export function EditableNumber({
  value,
  onSave,
  className,
  formatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  allowNegative = false,
  min,
  max,
  step = 0.01,
}: EditableNumberProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const handleClick = () => {
    setIsEditing(true)
    setInputValue(value.toString())
  }

  const handleBlur = () => {
    saveValue()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveValue()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setInputValue(value.toString())
    }
  }

  const saveValue = () => {
    const numValue = parseFloat(inputValue)

    if (isNaN(numValue)) {
      setInputValue(value.toString())
      setIsEditing(false)
      return
    }

    let finalValue = numValue

    // Apply constraints
    if (!allowNegative && finalValue < 0) {
      finalValue = 0
    }
    if (min !== undefined && finalValue < min) {
      finalValue = min
    }
    if (max !== undefined && finalValue > max) {
      finalValue = max
    }

    if (finalValue !== value) {
      onSave(finalValue)
    }

    setIsEditing(false)
  }

  const formattedValue = value.toLocaleString(undefined, formatOptions)

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'h-auto p-0 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0',
          className
        )}
        style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
        step={step}
        min={min}
        max={max}
      />
    )
  }

  return (
    <span
      onClick={handleClick}
      className={cn(
        'cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 transition-colors',
        className
      )}
      title="Click to edit"
    >
      {formattedValue}
    </span>
  )
}
