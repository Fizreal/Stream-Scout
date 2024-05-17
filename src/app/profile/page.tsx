'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import WatchlistsSection from '@/components/profile/WatchlistsSection'
import WatchedSection from '@/components/profile/WatchedSection'
import LikedSection from '@/components/profile/LikedSection'
import CreateWatchlistModal from '@/components/modals/CreateWatchlistModal'

const ProfilePage = () => {
  const searchParams = useSearchParams()

  const [showCreateModal, setShowCreateModal] = useState(false)

  const display = searchParams.get('display') || 'watchlists'
  const displayTranslation: { [key: string]: number } = {
    watchlists: 0,
    watched: 1,
    liked: 2
  }

  const handleDisplayChange = (display: string) => {
    window.history.replaceState(null, '', `?display=${display}`)
  }

  useEffect(() => {
    if (!searchParams.has('display')) {
      handleDisplayChange('watchlists')
    }
  }, [])

  return (
    <section className="w-full flex-flex-col">
      <div className="relative grid grid-cols-3 bg-PrimaryDark h-12 w-full md:max-w-lg md:rounded-lg">
        <button
          onClick={() => {
            setShowCreateModal(false)
            handleDisplayChange('watchlists')
          }}
          className={
            'z-10 w-full h-full' +
            (display === 'watchlists'
              ? ' sectionSelected'
              : ' sectionNotSelected')
          }
        >
          Watchlists
        </button>
        <button
          onClick={() => {
            setShowCreateModal(false)
            handleDisplayChange('watched')
          }}
          className={
            'z-10' +
            (display === 'watched' ? ' sectionSelected' : ' sectionNotSelected')
          }
        >
          Watched
        </button>
        <button
          onClick={() => {
            setShowCreateModal(false)
            handleDisplayChange('liked')
          }}
          className={
            'z-10' +
            (display === 'liked' ? ' sectionSelected' : ' sectionNotSelected')
          }
        >
          Liked
        </button>
        <div
          className="absolute top-0 left-0 h-full w-1/3 transition-all duration-300 p-2"
          style={{
            transform: `translateX(${
              displayTranslation[display]
                ? displayTranslation[display] * 100
                : 0
            }%)`
          }}
        >
          <div className="w-full h-full bg-BaseDark rounded"></div>
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        {display === 'watchlists' ? (
          <WatchlistsSection
            showCreateModal={showCreateModal}
            setShowCreateModal={setShowCreateModal}
          />
        ) : display === 'watched' ? (
          <WatchedSection />
        ) : (
          <LikedSection />
        )}
      </div>
      {showCreateModal && (
        <CreateWatchlistModal closeModal={() => setShowCreateModal(false)} />
      )}
    </section>
  )
}

export default ProfilePage
