import { useState, useLayoutEffect, RefObject } from 'react'

export const useIsOverflow = (ref: RefObject<HTMLDivElement>) => {
  const [isOverflow, setIsOverflow] = useState<boolean | undefined>(undefined)

  useLayoutEffect(() => {
    const { current } = ref
    const trigger = () => {
      if (!current) return
      const hasOverflow = current.scrollHeight > current.clientHeight
      setIsOverflow(hasOverflow)
    }

    trigger()

    if ('ResizeObserver' in window && current) {
      new ResizeObserver(trigger).observe(current)
    }
  }, [ref])

  return isOverflow
}
