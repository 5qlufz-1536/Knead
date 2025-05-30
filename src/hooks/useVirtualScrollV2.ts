import { useCallback, useEffect, useRef, useState } from 'react'

export interface VirtualScrollItem {
  index: number
  top: number
  height: number
}

interface UseVirtualScrollV2Options {
  itemCount: number
  getItemKey: (index: number) => string | number
  getItemHeight: (index: number) => number
  containerHeight: number
  overscan?: number
  initialScrollTop?: number
}

export function useVirtualScrollV2({
  itemCount,
  getItemKey,
  getItemHeight,
  containerHeight,
  overscan = 3,
  initialScrollTop = 0,
}: UseVirtualScrollV2Options) {
  const [scrollTop, setScrollTop] = useState(initialScrollTop)
  const [itemHeights, setItemHeights] = useState<number[]>(Array(itemCount).fill(0))
  const containerRef = useRef<HTMLDivElement>(null)

  // 各アイテムの高さを記録
  const setItemHeight = useCallback((index: number, height: number) => {
    setItemHeights((prev) => {
      if (prev[index] === height) return prev
      const next = [...prev]
      next[index] = height
      return next
    })
  }, [])

  // スクロールイベント
  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // 各アイテムのtop位置を計算
  const positions = [] as VirtualScrollItem[]
  let acc = 0
  for (let i = 0; i < itemCount; i++) {
    positions.push({ index: i, top: acc, height: itemHeights[i] || 40 })
    acc += itemHeights[i] || 40
  }
  const totalHeight = acc

  // 表示範囲を計算
  const startIdx = Math.max(0, positions.findIndex(p => p.top + p.height > scrollTop) - overscan)
  const endIdx = Math.min(itemCount, positions.findIndex(p => p.top > scrollTop + containerHeight) + overscan)
  const visibleItems = positions.slice(startIdx, endIdx > startIdx ? endIdx : undefined)

  // スクロール位置復元
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollTop
    }
  }, [containerRef, scrollTop])

  // リストが変わったら高さ配列をリセット
  useEffect(() => {
    setItemHeights(Array(itemCount).fill(0))
  }, [itemCount])

  return {
    containerRef,
    onScroll,
    visibleItems,
    setItemHeight,
    totalHeight,
    scrollTop,
    setScrollTop,
  }
}
