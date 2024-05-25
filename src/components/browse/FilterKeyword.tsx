import FilterBase from './FilterBase'
import { BrowseFilters } from '@/types'
import SubmitButton from '../SubmitButton'

type FilterKeywordProps = {
  filters: BrowseFilters
  keyword: string
  handleKeywordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleAddKeyword: (e: React.FormEvent<HTMLFormElement>) => void
  setFilters: (filters: BrowseFilters) => void
}

const FilterKeyword = ({
  filters,
  keyword,
  handleKeywordChange,
  handleAddKeyword,
  setFilters
}: FilterKeywordProps) => {
  return (
    <FilterBase title="Keyword">
      <div className="flex flex-col items-center gap-3 relative lg:absolute lg:left-1/2 lg:bottom-0 lg:translate-y-full lg:-translate-x-1/2 lg:rounded-xl w-full lg:w-56 p-2 bg-BaseLight fadeIn shadow-lg">
        {filters.keyword && (
          <div className="relative flex items-center justify-center p-2 px-6 bg-PrimaryDark rounded  text-white  min-w-[198px] max-w-full">
            <p className="text-wrap text-BaseLight/50">{filters.keyword}</p>

            <button
              className="absolute top-0 right-0 p-0.5 text-BaseLight w-7 aspect-square"
              onClick={() => setFilters({ ...filters, keyword: '' })}
            >
              x
            </button>
          </div>
        )}
        <form
          onSubmit={handleAddKeyword}
          className="flex flex-col items-center gap-2"
        >
          <input
            type="text"
            value={keyword}
            onChange={handleKeywordChange}
            placeholder="Zombies, aliens, etc."
            className="p-2 bg-PrimaryDark rounded border border-AccentLight text-white focus:outline-none focus:ring-2 focus:ring-AccentLight focus:border-transparent"
          />
          <SubmitButton
            text={filters.keyword ? 'Replace keyword' : 'Add keyword'}
            loading={false}
            disabled={filters.keyword.length > 0}
            width="fit"
          />
        </form>
      </div>
    </FilterBase>
  )
}

export default FilterKeyword
