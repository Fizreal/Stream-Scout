type SubmitButtonProps = {
  text: string
  disabled: boolean
  loading: boolean
  style?: 'primaryLight' | 'secondaryLight' | 'primaryDark' | 'secondaryDark'
  width?: 'full' | 'fit'
  onClick?: () => void
}

const SubmitButton = ({
  text,
  disabled,
  loading,
  style = 'primaryLight',
  width = 'full',
  onClick = () => {}
}: SubmitButtonProps) => {
  const styleType = {
    primaryLight:
      ' bg-AccentLight/75 enabled:hover:bg-AccentLight/50 text-PrimaryDark',
    secondaryLight:
      ' bg-BaseLight/75 enabled:hover:bg-BaseLight/50 text-PrimaryDark',
    primaryDark: ' bg-BaseDark/75 enabled:hover:bg-BaseDark text-AccentLight',
    secondaryDark:
      ' bg-PrimaryDark/75 enabled:hover:bg-PrimaryDark text-AccentLight'
  }[style]

  const widthFit = {
    full: ' w-full',
    fit: ' w-fit'
  }[width]

  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={onClick}
      className={
        'py-2 px-4 font-medium rounded-md transition-colors duration-300 ease-in-out h-fit' +
        styleType +
        widthFit
      }
    >
      {loading ? 'Loading...' : text}
    </button>
  )
}

export default SubmitButton
