import { BrowseFilters } from '@/types'
import FilterBase from './FilterBase'
import MultiRangeSlider from 'multi-range-slider-react'

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
    <FilterBase title="Release year">
      <div className="flex flex-col items-center gap-3 relative lg:absolute lg:left-1/2 lg:bottom-0 lg:translate-y-full lg:-translate-x-1/2 lg:rounded-xl w-full lg:w-64 p-2 bg-BaseLight fadeIn">
        <div className="flex items-center justify-center gap-1 w-full">
          <span>{min}</span>
          <div className="flex-grow">
            <MultiRangeSlider
              min={min}
              max={max}
              minValue={filters.minYear}
              maxValue={filters.maxYear}
              onChange={({ min, max }) =>
                setFilters({ ...filters, minYear: min, maxYear: max })
              }
              label={false}
              ruler={false}
              canMinMaxValueSame={true}
              barInnerColor="#76ABAE"
              style={{ border: 'none', boxShadow: 'none' }}
            />
          </div>
          <span>{max}</span>
        </div>
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() =>
              setFilters({ ...filters, minYear: max, maxYear: max })
            }
            className={
              'flex items-center justify-center gap-1 rounded py-1 px-2' +
              (filters.minYear === max && filters.maxYear === max
                ? ' bg-PrimaryDark/50'
                : '')
            }
          >
            <img src="/checkmark.svg" alt="Select" className="h-4" />
            <p>This year</p>
          </button>
          <button
            onClick={() =>
              setFilters({ ...filters, minYear: max - 1, maxYear: max - 1 })
            }
            className={
              'flex items-center justify-center gap-1 rounded py-1 px-2' +
              (filters.minYear === max - 1 && filters.maxYear === max - 1
                ? ' bg-PrimaryDark/50'
                : '')
            }
          >
            <img src="/checkmark.svg" alt="Select" className="h-4" />
            <p>Last year</p>
          </button>
        </div>
      </div>
    </FilterBase>
  )
}

export default FilterReleaseYear
