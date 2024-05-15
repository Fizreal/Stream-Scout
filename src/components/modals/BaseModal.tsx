type BaseModalProps = {
  children: React.ReactNode
  onClick?: () => void
}

const BaseModal = ({
  children,
  onClick = () => console.log('click')
}: BaseModalProps) => {
  return (
    <div className="fixed top-0 left-0 flex justify-center items-center h-dvh w-dvw z-40 text-white">
      <div
        className="absolute top-0 left-0 h-full w-full bg-black/50 backdrop-blur"
        onClick={onClick}
      ></div>
      {children}
    </div>
  )
}

export default BaseModal
