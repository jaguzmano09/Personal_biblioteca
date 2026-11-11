'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface Props {
  id: string
  value: string
  onChange: (value: string) => void
  autoComplete: 'current-password' | 'new-password'
  minLength?: number
  describedBy?: string
}

export default function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  minLength,
  describedBy
}: Props) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        required
        minLength={minLength}
        maxLength={128}
        value={value}
        onChange={event => onChange(event.target.value)}
        aria-describedby={describedBy}
        className="editorial-input pr-14"
      />
      <button
        type="button"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-pressed={visible}
        aria-controls={id}
        onClick={() => setVisible(!visible)}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-md text-cloth"
      >
        {visible ? (
          <EyeOff aria-hidden="true" className="size-5" />
        ) : (
          <Eye aria-hidden="true" className="size-5" />
        )}
      </button>
    </div>
  )
}
