'use client'

import { useState, useEffect, useRef } from 'react'
import { Watchlist } from '@/types'

type WatchlistOptionsProps = {
  watchlist: Watchlist
  showInviteModal: () => void
  showLeaveModal: () => void
}

const WatchlistOptions = ({
  watchlist,
  showInviteModal,
  showLeaveModal
}: WatchlistOptionsProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
    const handleClickOutsideOptions = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowOptions(false)
      }
    }

    document.addEventListener('mouseup', handleClickOutsideOptions)
    document.addEventListener('touchend', handleClickOutsideOptions)

    return () => {
      document.removeEventListener('mouseup', handleClickOutsideOptions)
      document.removeEventListener('touchend', handleClickOutsideOptions)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="absolute top-0 right-6 h-9 lg:h-11 aspect-square z-10 pb-1"
    >
      <button
        className="flex items-center justify-center h-full w-full rounded-full bg-PrimaryDark/50 p-1"
        aria-label={showOptions ? 'Hide options' : 'Show options'}
        onClick={() => setShowOptions((prev) => !prev)}
      >
        <img src="/dragIcon.svg" alt="Open" className="whiteSVG" />
      </button>
      {showOptions && (
        <div className="flex flex-col items-center gap-2 absolute right-0 bottom-0 translate-y-full xl:right-1/2 xl:translate-x-1/2 rounded-xl w-44 z-10 p-2 bg-BaseLight fadeIn">
          <button
            onClick={() => {
              setShowOptions(false)
              showInviteModal()
            }}
            className="rounded-lg bg-PrimaryDark hover:bg-PrimaryDark/80 text-AccentLight w-full px-1 py-0.5"
          >
            Invite to watchlist
          </button>
          <button
            onClick={() => {
              setShowOptions(false)
              showLeaveModal()
            }}
            className="rounded-lg bg-PrimaryDark hover:bg-PrimaryDark/80 text-AccentLight w-full px-1 py-0.5"
          >
            {watchlist.owners.length > 1
              ? 'Leave watchlist'
              : 'Delete watchlist'}
          </button>
        </div>
      )}
    </div>
  )
}

export default WatchlistOptions
