'use client'

import { Content } from '@/types'
import { useState } from 'react'
import { TitleSearch } from '@/utils/rapid-api'
import { useUser } from '@/context/UserContext'
import { formatResult } from '@/utils/content-methods'
import ContentCard from '@/conponents/ContentCard'

const SearchPage = () => {
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<Content[] | any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()
    // if (!user) return
    const data = await TitleSearch(title)
    console.log(data)
    let formattedData = data.result.map((content: any) => formatResult(content))
    setContent(formattedData)
    setTitle('')
    setLoading(false)
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={handleChange}
            placeholder="Search for a title"
          />
          <button type="submit">Search</button>
        </form>
        <div>
          {content.map((item) => (
            <ContentCard key={item.tmdbId} content={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
