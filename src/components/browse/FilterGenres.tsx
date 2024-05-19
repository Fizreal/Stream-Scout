import FilterBase from './FilterBase'
import { genreNames } from '@/utils/object-maps'
import { BrowseFilters } from '@/types'

type FilterGenresProps = {
  filters: BrowseFilters
  handleChangeGenre: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FilterGenres = ({ filters, handleChangeGenre }: FilterGenresProps) => {
  const genres = Object.keys(genreNames)

  return (
    <FilterBase title="Genres">
      <div className="grid grid-cols-2 gap-2 absolute left-1/2 bottom-0 translate-y-full -translate-x-1/2 rounded-xl w-56 p-2 bg-BaseLight fadeIn">
        {genres.map((genre) => (
          <label key={genre} className="flex items-center">
            <input
              type="checkbox"
              name="genres"
              value={genre}
              onChange={handleChangeGenre}
              className="hidden"
            />
            <img src="/checkmark.svg" alt="Select" />
            {genreNames[genre]}
          </label>
        ))}
      </div>
    </FilterBase>
  )
}

export default FilterGenres
