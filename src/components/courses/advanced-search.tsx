import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Slider } from '../ui/slider'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'

interface AdvancedSearchProps {
  categories: { id: string; name: string }[]
  initialFilters?: SearchFilters
}

interface SearchFilters {
  minRating?: number
  maxPrice?: number
  categories?: string[]
  hasVideo?: boolean
  hasCertificate?: boolean
}

export function AdvancedSearch({ categories, initialFilters = {} }: AdvancedSearchProps) {
  const router = useRouter()
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (filters.minRating) params.set('minRating', filters.minRating.toString())
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
    if (filters.categories?.length) params.set('categories', filters.categories.join(','))
    if (filters.hasVideo) params.set('hasVideo', 'true')
    if (filters.hasCertificate) params.set('hasCertificate', 'true')
    
    router.push(`/courses/search?${params.toString()}`)
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <div>
        <h3 className="font-medium mb-2">Rating</h3>
        <Slider
          value={[filters.minRating || 0]}
          onValueChange={([value]) => setFilters({ ...filters, minRating: value })}
          max={5}
          step={0.5}
        />
      </div>

      <div>
        <h3 className="font-medium mb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <Checkbox
                id={category.id}
                checked={filters.categories?.includes(category.id)}
                onCheckedChange={(checked) => {
                  const newCategories = checked
                    ? [...(filters.categories || []), category.id]
                    : filters.categories?.filter(id => id !== category.id)
                  setFilters({ ...filters, categories: newCategories })
                }}
              />
              <label htmlFor={category.id} className="ml-2">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <Checkbox
            id="hasVideo"
            checked={filters.hasVideo}
            onCheckedChange={(checked) => 
              setFilters({ ...filters, hasVideo: !!checked })
            }
          />
          <label htmlFor="hasVideo" className="ml-2">
            Has Video Content
          </label>
        </div>

        <div className="flex items-center">
          <Checkbox
            id="hasCertificate"
            checked={filters.hasCertificate}
            onCheckedChange={(checked) => 
              setFilters({ ...filters, hasCertificate: !!checked })
            }
          />
          <label htmlFor="hasCertificate" className="ml-2">
            Includes Certificate
          </label>
        </div>
      </div>

      <Button onClick={applyFilters} className="w-full">
        Apply Filters
      </Button>
    </div>
  )
} 