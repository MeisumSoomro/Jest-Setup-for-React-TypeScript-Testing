import { useState } from 'react'
import { Button } from '../ui/button'
import { Select } from '../ui/select'

interface ReviewFiltersProps {
  onFilterChange: (filters: ReviewFilters) => void
}

interface ReviewFilters {
  sortBy: 'recent' | 'helpful' | 'rating'
  rating?: number
  hasComment?: boolean
}

export function ReviewFilters({ onFilterChange }: ReviewFiltersProps) {
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: 'recent'
  })

  const updateFilters = (newFilters: Partial<ReviewFilters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange(updated)
  }

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Select
        value={filters.sortBy}
        onValueChange={(value) => 
          updateFilters({ sortBy: value as ReviewFilters['sortBy'] })
        }
      >
        <option value="recent">Most Recent</option>
        <option value="helpful">Most Helpful</option>
        <option value="rating">Highest Rated</option>
      </Select>

      <Select
        value={filters.rating?.toString() || ''}
        onValueChange={(value) => 
          updateFilters({ rating: value ? parseInt(value) : undefined })
        }
      >
        <option value="">All Ratings</option>
        <option value="5">5 Stars</option>
        <option value="4">4+ Stars</option>
        <option value="3">3+ Stars</option>
      </Select>

      <Button
        variant="outline"
        onClick={() => 
          updateFilters({ hasComment: !filters.hasComment })
        }
        className={filters.hasComment ? 'bg-primary text-white' : ''}
      >
        With Comments
      </Button>
    </div>
  )
} 