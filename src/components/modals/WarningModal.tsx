import BaseModal from './BaseModal'

type WarningModalProps = {
  closeModal: () => void
  title: string
  handleAffirmative: () => void
  affirmativeText: string
}

const WarningModal = ({
  closeModal,
  title,
  handleAffirmative,
  affirmativeText
}: WarningModalProps) => {
  return (
    <BaseModal onClick={closeModal}>
      <div className="flex flex-col items-center z-10 w-4/5 max-w-md bg-PrimaryDark p-8 gap-6 rounded-lg">
        <h2 className="text-center">{title}</h2>
        <div className="flex justify-around w-full">
          <button
            onClick={closeModal}
            className="rounded-full w-28 bg-BaseDark/75 hover:bg-BaseDark hover:text-AccentLight  py-1 px-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAffirmative}
            className="rounded-full w-28 border-2 border-BaseDark/75 hover:border-BaseDark hover:bg-BaseDark hover:text-AccentLight py-1 px-2 shadow-lg"
          >
            {affirmativeText}
          </button>
        </div>
      </div>
    </BaseModal>
  )
}

export default WarningModal
