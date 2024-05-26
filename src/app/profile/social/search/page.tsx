'use client'

import { useSocket } from '@/context/SocketContext'
import { useState } from 'react'
import { PublicProfile } from '@/types'
import ProfileCard from '@/components/cards/ProfileCard'
import SubmitButton from '@/components/SubmitButton'

const ProfileSearchPage = () => {
  const socket = useSocket()
  const [username, setUsername] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<PublicProfile[] | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    socket?.emit(
      'search profiles',
      { search: username },
      ({
        success,
        profiles,
        error
      }: {
        success: boolean
        profiles?: PublicProfile[]
        error?: string
      }) => {
        if (success && profiles) {
          setResults(profiles)
        } else {
          console.log(error)
        }
        setLoading(false)
        setUsername('')
      }
    )
  }

  return (
    <section className="gap-4">
      <form
        onSubmit={handleSearch}
        className="flex flex-col items-center gap-2"
      >
        <input
          type="text"
          value={username}
          onChange={handleChange}
          placeholder="Search for a username"
          className="w-60 p-2 bg-PrimaryDark rounded border border-AccentLight text-white focus:outline-none focus:ring-2 focus:ring-AccentLight focus:border-transparent"
        />
        <SubmitButton
          disabled={!username}
          loading={loading}
          text="Search"
          width="fit"
        />
      </form>
      <div className="flex justify-center w-full">
        {results &&
          results.map((result) => (
            <ProfileCard key={result._id} profile={result} />
          ))}
      </div>
    </section>
  )
}

export default ProfileSearchPage
