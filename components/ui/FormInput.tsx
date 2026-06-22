'use client'

import { type InputHTMLAttributes, type TextareaHTMLAttributes, useId } from 'react'

interface BaseProps {
  label: string
  error?: string
  required?: boolean
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { as?: 'input' }
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' }
type SelectProps = BaseProps & {
  as: 'select'
  options: { value: string; label: string }[]
} & Omit<InputHTMLAttributes<HTMLSelectElement>, 'children'>

type FormInputProps = InputProps | TextareaProps | SelectProps

export function FormInput(props: FormInputProps) {
  const id = useId()
  const { label, error, required, as = 'input', className = '', ...rest } = props

  const fieldClass = [
    'w-full bg-surface-raised border rounded-md font-body text-base px-4 py-3',
    'focus:outline-none focus:border-oak',
    error ? 'border-error' : 'border-[rgba(42,39,36,0.10)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className,
  ].join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-sm text-muted">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      {as === 'textarea' ? (
        <textarea
          id={id}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          rows={4}
          className={`${fieldClass} resize-y min-h-[120px]`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : as === 'select' ? (
        <select
          id={id}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={fieldClass}
          {...(rest as Omit<InputHTMLAttributes<HTMLSelectElement>, 'children'>)}
        >
          {(props as SelectProps).options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${fieldClass} min-h-[48px]`}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="font-utility text-[11px] text-error">
          {error}
        </p>
      )}
    </div>
  )
}
