import { Watched } from '@/types'

const WatchedSection = ({ watchedContent }: { watchedContent: Watched[] }) => {
  return (
    <div className="fadeIn">
      {watchedContent.map((watched) => (
        <div key={watched._id}></div>
      ))}
    </div>
  )
}

export default WatchedSection
