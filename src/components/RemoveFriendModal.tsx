import { PublicProfile } from '@/types'

type RemoveFriendModalProps = {
  friend: PublicProfile
  closeModal: () => void
}

const RemoveFriendModal = ({ friend, closeModal }: RemoveFriendModalProps) => {
  return (
    <div className="fixed top-0 left-0 flex justify-center items-center h-dvh w-dvw z-40 text-white">
      <div
        className="absolute top-0 left-0 h-full w-full bg-black/50 backdrop-blur"
        onClick={closeModal}
      ></div>
      <div className="flex flex-col items-center z-10 w-4/5 max-w-xl bg-BaseDark h-1/2 p-8 gap-4 rounded">
        <p>
          Are you sure you want to remove {friend.username} from your
          friendlist?
        </p>
        <div className="flex justify-around w-full">
          <button>Remove</button>
          <button>Back</button>
        </div>
      </div>
    </div>
  )
}
export default RemoveFriendModal
