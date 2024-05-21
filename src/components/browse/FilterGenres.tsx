import FilterBase from './FilterBase'
import { genreNames } from '@/utils/object-maps'
import { BrowseFilters } from '@/types'

type FilterGenresProps = {
  filters: BrowseFilters
  handleChangeGenre: (genre: string) => void
}

const FilterGenres = ({ filters, handleChangeGenre }: FilterGenresProps) => {
  const genres = Object.keys(genreNames)

  return (
    <FilterBase title="Genres">
      <div className="grid grid-cols-2 gap-2 relative lg:absolute lg:left-1/2 lg:bottom-0 lg:translate-y-full lg:-translate-x-1/2 lg:rounded-xl w-full lg:w-80 p-2 bg-BaseLight fadeIn">
        {genres.map((genre) => (
          <button
            key={genre}
            className={
              'flex items-center justify-center gap-1 py-1 rounded' +
              (filters.genres.includes(genre)
                ? ' bg-PrimaryDark/50 text-white'
                : '')
            }
            onClick={() => handleChangeGenre(genre)}
          >
            <img src="/checkmark.svg" alt="Select" className="h-4" />
            <p>{genreNames[genre]}</p>
          </button>
        ))}
      </div>
    </FilterBase>
  )
}

export default FilterGenres
