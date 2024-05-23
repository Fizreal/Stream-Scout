type SubmitButtonProps = {
  text: string
  disabled: boolean
  loading: boolean
  onClick?: () => void
}

const SubmitButton = ({
  text,
  disabled,
  loading,
  onClick = () => {}
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={onClick}
      className="py-2 px-3 bg-AccentLight/75 hover:bg-AccentLight/50 text-PrimaryDark font-medium rounded-md transition-colors duration-300 ease-in-out"
    >
      {loading ? 'Loading...' : text}
    </button>
  )
}

export default SubmitButton
