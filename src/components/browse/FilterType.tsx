import FilterBase from './FilterBase'
import { BrowseFilters } from '@/types'

type FilterTypeProps = {
  filters: BrowseFilters
  handleContentFilter: (contentType: string) => void
}

const FilterType = ({ filters, handleContentFilter }: FilterTypeProps) => {
  const displayTranslation: { [key: string]: number } = {
    All: 0,
    Movies: 1,
    Shows: 2
  }

  return (
    <FilterBase title="Content type">
      <div className="flex flex-col items-center gap-3 absolute left-1/2 bottom-0 translate-y-full -translate-x-1/2 rounded-xl w-56 p-2 bg-BaseLight fadeIn">
        <p>Show me:</p>
        <div className="relative grid grid-cols-3 w-full h-8 bg-BaseDark rounded-full">
          <button
            className={
              'z-10 w-full h-full' +
              (filters.contentType === 'All'
                ? ' sectionSelected'
                : ' sectionNotSelected')
            }
            onClick={() => handleContentFilter('all')}
          >
            All
          </button>
          <button
            className={
              'z-10' +
              (filters.contentType === 'Movies'
                ? ' sectionSelected'
                : ' sectionNotSelected')
            }
            onClick={() => handleContentFilter('movie')}
          >
            Movies
          </button>
          <button
            className={
              'z-10' +
              (filters.contentType === 'Shows'
                ? ' sectionSelected'
                : ' sectionNotSelected')
            }
            onClick={() => handleContentFilter('series')}
          >
            Shows
          </button>
          <div
            className="absolute top-0 left-0 h-full w-1/3 transition-all duration-300 p-2 rounded-full bg-PrimaryDark"
            style={{
              transform: `translateX(${
                displayTranslation[filters.contentType]
                  ? displayTranslation[filters.contentType] * 100
                  : 0
              }%)`
            }}
          ></div>
        </div>
      </div>
    </FilterBase>
  )
}

export default FilterType
