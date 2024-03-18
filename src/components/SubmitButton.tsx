type SubmitButtonProps = {
  text: string
  disabled: boolean
  loading: boolean
}

const SubmitButton = ({ text, disabled, loading }: SubmitButtonProps) => {
  return (
    <button type="submit" disabled={disabled}>
      {loading ? 'Loading...' : text}
    </button>
  )
}

export default SubmitButton
