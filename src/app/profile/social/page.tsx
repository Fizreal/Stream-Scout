import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import FriendSection from '@/components/profile/social/FriendSection'

const SocialPage = () => {
  const { user } = useUser()

  const [display, setDisplay] = useState('friends')
  const displayTranslation: { [key: string]: number } = {
    friends: 0,
    invitations: 1
  }

  return (
    <section>
      <h1>Social</h1>
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
      <div>
        <FriendSection
          friends={
            user?.friends
              ? user.friends.filter((friend) => friend.status === 3)
              : []
          }
        />
      </div>
    </section>
  )
}

export default SocialPage
