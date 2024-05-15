import { PublicProfile } from '@/types'
import BaseModal from './BaseModal'

type RemoveFriendModalProps = {
  friend: PublicProfile
  closeModal: () => void
}

const RemoveFriendModal = ({ friend, closeModal }: RemoveFriendModalProps) => {
  return (
    <BaseModal onClick={closeModal}>
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
    </BaseModal>
  )
}
export default RemoveFriendModal
