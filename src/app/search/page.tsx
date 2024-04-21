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
    <main>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={handleChange}
            placeholder="Search for a title"
          />
          <SubmitButton text="Search" disabled={false} loading={loading} />
        </form>
        <div className="flex flex-col gap-6 p-6 max-w-[1024px]">
          {content.map((item) => (
            <ContentCard key={item.tmdbId} content={item} type="search" />
          ))}
        </div>
      </div>
    </main>
  )
}

export default SearchPage
