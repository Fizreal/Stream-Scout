type SubmitButtonProps = {
  type?: 'submit' | 'button'
  text: string
  disabled: boolean
  loading: boolean
  style?: 'primaryLight' | 'secondaryLight' | 'primaryDark' | 'secondaryDark'
  width?: 'full' | 'fit' | 'grow'
  onClick?: () => void
}

const SubmitButton = ({
  type = 'submit',
  text,
  disabled,
  loading,
  style = 'primaryLight',
  width = 'full',
  onClick = () => {}
}: SubmitButtonProps) => {
  const styleType = {
    primaryLight:
      ' bg-AccentLight/75 enabled:hover:bg-AccentLight/50 text-PrimaryDark focus:ring-2 focus:ring-AccentLight focus:ring-offset-PrimaryDark focus:ring-offset-2',
    secondaryLight:
      ' bg-BaseLight/75 enabled:hover:bg-BaseLight/50 text-PrimaryDark focus:ring-2 focus:ring-BaseLight focus:ring-offset-PrimaryDark focus:ring-offset-2',
    primaryDark:
      ' bg-BaseDark/75 enabled:hover:bg-BaseDark text-AccentLight focus:ring-2 focus:ring-BaseDark focus:ring-offset-AccentLight focus:ring-offset-2',
    secondaryDark:
      ' bg-PrimaryDark/75 enabled:hover:bg-PrimaryDark text-AccentLight focus:ring-2 focus:ring-PrimaryDark focus:ring-offset-AccentLight focus:ring-offset-2'
  }[style]

  const widthFit = {
    full: ' w-full',
    fit: ' w-fit',
    grow: ' flex-grow'
  }[width]

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={
        'py-2 px-4 font-medium rounded-md transition-colors duration-300 ease-in-out h-fit shadow-lg' +
        styleType +
        widthFit
      }
    >
      {loading ? 'Loading...' : text}
    </button>
  )
}

export default SubmitButton
