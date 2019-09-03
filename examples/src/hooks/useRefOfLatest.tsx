import { useEffect, useRef } from 'react'

/**
 * updated value will be available in useEffects and next renders
 * @param value
 */
export default function useRefOfLatest<T>(value: T) {
  const refLatest = useRef(value)

  useEffect(() => {
    refLatest.current = value
  }, [value])

  return refLatest
}
