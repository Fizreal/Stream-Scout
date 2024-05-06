import { Watchlist } from '@/types'

const LikedSection = ({ watchlists }: { watchlists: Watchlist[] }) => {
  return (
    <div className="fadeIn">
      {watchlists.map((watchlist) => (
        <div key={watchlist._id}></div>
      ))}
    </div>
  )
}

export default LikedSection
