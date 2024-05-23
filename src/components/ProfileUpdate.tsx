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
}

const ProfileUpdate = ({
  profileForm,
  errorMessage,
  submitText,
  handleSubmit,
  handleFormChange
}: ProfileUpdateProps) => {
  const availableServices = useMemo(() => {
    if (!profileForm.country) return null

    return Countries.find(
      (country) => country.countryCode === profileForm.country
    )?.services
  }, [profileForm])

  return (
    <form onSubmit={handleSubmit}>
      {profileForm.username !== undefined && (
        <fieldset>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            value={profileForm.username}
            onChange={handleFormChange}
          />
          <p>{errorMessage}</p>
        </fieldset>
      )}
      <fieldset>
        <label htmlFor="country">Country:</label>
        <select
          name="country"
          value={profileForm.country}
          onChange={handleFormChange}
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
      <fieldset>
        <legend>Subscriptions:</legend>
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
      </fieldset>
      <SubmitButton
        text={submitText}
        disabled={
          profileForm.username &&
          profileForm.country &&
          profileForm.subscriptions.length
            ? false
            : true
        }
        loading={false}
      />
    </form>
  )
}

export default ProfileUpdate
