import FilterBase from './FilterBase'
import { BrowseFilters } from '@/types'

type FilterKeywordProps = {
  filters: BrowseFilters
  keyword: string
  handleKeywordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleAddKeyword: (e: React.FormEvent<HTMLFormElement>) => void
}

const FilterKeyword = ({
  filters,
  keyword,
  handleKeywordChange,
  handleAddKeyword
}: FilterKeywordProps) => {
  return (
    <FilterBase title="Keyword">
      <div className="flex flex-col items-center gap-3 relative lg:absolute lg:left-1/2 lg:bottom-0 lg:translate-y-full lg:-translate-x-1/2 lg:rounded-xl w-full lg:w-56 p-2 bg-BaseLight fadeIn">
        <div>
          {filters.keyword && (
            <div className="relative flex items-center justify-center">
              <p>{filters.keyword}</p>
              <button className="absolute top-0 left-3/4 p-1">x</button>
            </div>
          )}
        </div>
        <form onSubmit={handleAddKeyword}>
          <input
            type="text"
            value={keyword}
            onChange={handleKeywordChange}
            placeholder="Zombies, aliens, etc."
            className="p-2 bg-PrimaryDark rounded border border-AccentLight text-white focus:outline-none focus:ring-2 focus:ring-AccentLight focus:border-transparent"
          />
          <button disabled={filters.keyword.length > 0}>
            {filters.keyword ? 'Add keyword' : 'Replace keyword'}
          </button>
        </form>
      </div>
    </FilterBase>
  )
}

export default FilterKeyword
