import { useMemo } from 'react'
import { ProfileForm, Country, Service } from '@/types'
import SubmitButton from './SubmitButton'
import Countries from '@/utils/services.json'

type ProfileUpdateProps = {
  profileForm: ProfileForm
  errorMessage: string
  submitText: string
  handleFormChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  handleDiscard?: () => void
}

const ProfileUpdate = ({
  profileForm,
  errorMessage,
  submitText,
  handleSubmit,
  handleFormChange,
  handleDiscard
}: ProfileUpdateProps) => {
  const availableServices = useMemo(() => {
    if (!profileForm.country) return null

    return Countries.find(
      (country) => country.countryCode === profileForm.country
    )?.services
  }, [profileForm])

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-2 w-full max-w-lg p-4 bg-BaseLight rounded-md shadow-md"
    >
      {profileForm.username !== undefined && (
        <fieldset>
          <label
            htmlFor="username"
            className="text-lg text-PrimaryDark font-semibold mr-2"
          >
            Username:
          </label>
          <input
            type="text"
            name="username"
            value={profileForm.username}
            onChange={handleFormChange}
            className="w-60 p-2 bg-PrimaryDark rounded border border-AccentLight text-white focus:outline-none focus:ring-2 focus:ring-AccentLight focus:border-transparent"
          />
          <p>{errorMessage}</p>
        </fieldset>
      )}
      <fieldset>
        <label
          htmlFor="country"
          className="text-lg text-PrimaryDark font-semibold mr-2"
        >
          Country:
        </label>
        <select
          name="country"
          value={profileForm.country}
          onChange={handleFormChange}
          className="bg-black/50 text-white rounded-md p-2 md:w-auto"
        >
          {profileForm.country === '' && (
            <option value="" disabled>
              Select a country
            </option>
          )}
          {Countries.map((country: Country) => (
            <option key={country.countryCode} value={country.countryCode}>
              {country.name}
            </option>
          ))}
        </select>
      </fieldset>
      <fieldset className="flex flex-col gap-1 items-center">
        <label className="text-lg text-PrimaryDark font-semibold">
          Subscriptions
        </label>
        <div className="grid grid-cols-2 gap-1 w-full">
          {availableServices?.map((service: Service) => (
            <label key={service.id}>
              <input
                type="checkbox"
                name="subscriptions"
                value={service.id}
                onChange={handleFormChange}
              />
              {service.name}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="w-full flex justify-around items-center gap-2">
        <SubmitButton
          text={submitText}
          disabled={
            (profileForm.username === undefined || profileForm?.username) &&
            profileForm.country &&
            profileForm.subscriptions.length
              ? false
              : true
          }
          loading={false}
          width={handleDiscard ? 'grow' : 'fit'}
          style="primaryDark"
        />
        {handleDiscard && (
          <SubmitButton
            text="Discard changes"
            onClick={handleDiscard}
            width="grow"
            loading={false}
            disabled={false}
            style="secondaryDark"
          />
        )}
      </div>
    </form>
  )
}

export default ProfileUpdate
