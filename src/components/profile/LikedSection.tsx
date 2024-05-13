import { Watched } from '@/types'

const LikedSection = ({ likedContent }: { likedContent: Watched[] }) => {
  return (
    <div className="fadeIn">
      {likedContent.map((liked) => (
        <div key={liked._id}></div>
      ))}
    </div>
  )
}

export default LikedSection
