'use client'

import { Content } from '@/types'
import { useState } from 'react'
import { TitleSearch } from '@/utils/rapid-api'
import { useUser } from '@/context/UserContext'
import { formatResult } from '@/utils/content-methods'
import ContentCard from '@/components/cards/ContentCard'
import SubmitButton from '@/components/SubmitButton'

const SearchPage = () => {
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<Content[] | any[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if (!user) return
    try {
      const data = await TitleSearch(user, title)
      const tmdbIds = new Set()
      for (let i = data.result.length - 1; i >= 0; i--) {
        if (tmdbIds.has(data.result[i].tmdbId)) {
          data.result.splice(i, 1)
        } else {
          tmdbIds.add(data.result[i].tmdbId)
        }
      }
      console.log(data)

      let formattedData = data.result.map((content: any) =>
        formatResult(content)
      )
      setContent(formattedData)
      setTitle('')
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setLoading(false)
    }
  }

  return (
    <section>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2"
      >
        <input
          type="text"
          value={title}
          onChange={handleChange}
          placeholder="Search for a title"
          className="w-60 p-2 bg-PrimaryDark rounded border border-AccentLight text-white focus:outline-none focus:ring-2 focus:ring-AccentLight focus:border-transparent"
        />

        <SubmitButton
          text="Search"
          disabled={false}
          loading={loading}
          width="fit"
        />
      </form>
      <div className="flex flex-col gap-6 p-6 max-w-[1024px]">
        {content.map((item) => (
          <ContentCard key={item.tmdbId} content={item} type="search" />
        ))}
      </div>
    </section>
  )
}

export default SearchPage
