import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {}
}: PaginationProps) {
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams({ ...searchParams, page: page.toString() })
    return `${baseUrl}?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        disabled={currentPage <= 1}
        asChild
      >
        <Link href={getPageUrl(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      </Button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link href={getPageUrl(page)}>
              {page}
            </Link>
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        disabled={currentPage >= totalPages}
        asChild
      >
        <Link href={getPageUrl(currentPage + 1)}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
} 