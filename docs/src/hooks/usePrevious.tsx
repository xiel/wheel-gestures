import { useEffect, useRef } from 'react'

export default function usePrevious<T>(value: T): T | void {
  const ref = useRef<T>()

  // store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value])

  // Return previous value (happens before update in useEffect above)
  return ref.current
}
