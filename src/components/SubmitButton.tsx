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
    <button type="submit" disabled={disabled} onClick={onClick}>
      {loading ? 'Loading...' : text}
    </button>
  )
}

export default SubmitButton
