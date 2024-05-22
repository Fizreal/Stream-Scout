'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import FriendSection from '@/components/profile/social/FriendSection'
import InvitationSection from '@/components/profile/social/InvitationSection'
import Link from 'next/link'

const SocialPage = () => {
  const { user } = useUser()

  const [display, setDisplay] = useState('friends')
  const displayTranslation: { [key: string]: number } = {
    friends: 0,
    invitations: 1
  }

  return (
    <section>
      <Link
        href="/profile/social/search"
        className="py-2 px-4 bg-AccentLight/50 hover:bg-AccentLight rounded-lg text-lg my-3 text-BaseDark"
      >
        Search for friends
      </Link>
      <div className="relative grid grid-cols-2 bg-PrimaryDark h-12 w-full md:max-w-lg md:rounded-lg">
        <button
          onClick={() => setDisplay('friends')}
          className={
            'z-10 w-full h-full' +
            (display === 'friends' ? ' sectionSelected' : ' sectionNotSelected')
          }
        >
          Friends
        </button>
        <button
          onClick={() => setDisplay('invitations')}
          className={
            'z-10 w-full h-full' +
            (display === 'invitations'
              ? ' sectionSelected'
              : ' sectionNotSelected')
          }
        >
          Invitations
        </button>
        <div
          className="absolute top-0 left-0 h-full w-1/2 transition-all duration-300 p-2"
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
      <div className="w-full p-4">
        {display === 'friends' && (
          <FriendSection
            friends={
              user?.friends
                ? user.friends.filter((friend) => friend.status === 3)
                : []
            }
          />
        )}
        {display === 'invitations' && (
          <InvitationSection friends={user?.friends ? user.friends : []} />
        )}
      </div>
    </section>
  )
}

export default SocialPage
