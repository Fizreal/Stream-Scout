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
      <div className="flex flex-col items-center z-10 w-4/5 max-w-xl bg-BaseDark h-1/2 p-8 gap-4 rounded">
        <h2>{title}</h2>
        <div className="flex justify-around w-full">
          <button onClick={closeModal}>Back</button>
          <button onClick={handleAffirmative}>{affirmativeText}</button>
        </div>
      </div>
    </BaseModal>
  )
}

export default WarningModal
