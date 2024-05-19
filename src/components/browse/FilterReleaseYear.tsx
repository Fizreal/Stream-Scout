import { BrowseFilters } from '@/types'
import FilterBase from './FilterBase'

type FilterReleaseYearProps = {
  filters: BrowseFilters
  setFilters: (filters: BrowseFilters) => void
}

const FilterReleaseYear = ({ filters, setFilters }: FilterReleaseYearProps) => {
  const min = 1900
  const max = new Date().getFullYear()

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    if (newValue >= min && newValue <= filters.maxYear) {
      setFilters({ ...filters, minYear: newValue })
    }
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    if (newValue >= filters.minYear && newValue <= max) {
      setFilters({ ...filters, maxYear: newValue })
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 absolute left-1/2 bottom-0 translate-y-full -translate-x-1/2 rounded-xl w-56 p-2 bg-BaseLight fadeIn">
      <div>
        <span>{min}</span>
        <div>
          <input
            type="range"
            min={min}
            max={max}
            value={filters.minYear}
            onChange={handleFromChange}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={filters.maxYear}
            onChange={handleToChange}
          />
        </div>
        <span>{max}</span>
      </div>
      <div>
        <button
          onClick={() => setFilters({ ...filters, minYear: max, maxYear: max })}
        >
          <img src="/checkmark.svg" alt="Select" />
          This year
        </button>
        <button
          onClick={() =>
            setFilters({ ...filters, minYear: max - 1, maxYear: max - 1 })
          }
        >
          <img src="/checkmark.svg" alt="Select" />
          Last year
        </button>
      </div>
    </div>
  )
}

export default FilterReleaseYear
