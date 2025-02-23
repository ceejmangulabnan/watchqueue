import { useSearchParams, useNavigate } from "react-router-dom"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SearchResultsPagination = ({ totalPages }: { totalPages: number | undefined }) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query")
  const pageParams = Number(searchParams.get("page")) || 1; // Default to page 1
  const navigate = useNavigate()

  const pageNumbers = []
  const range = 2

  for (let i = Math.max(1, pageParams - range); i <= Math.min(totalPages ?? 0, pageParams + range); i++) {
    pageNumbers.push(i)
  }

  const handlePageChange = (newPage: number) => {
    navigate(`/search/multi?query=${searchQuery}&page=${newPage}`)
  }

  return (
    <div className='my-6'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant={'ghost'}
              disabled={pageParams <= 1 ? true : false}
              onClick={() => handlePageChange(pageParams - 1)}
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
          </PaginationItem>

          {pageNumbers.map((num) => (
            <PaginationItem
              key={num}
              onClick={() => handlePageChange(num)}
              className={`cursor-pointer px-3 py-1 rounded ${num === pageParams ? "text-white dark:text-black dark:bg-gray-200 bg-black" : "dark:bg-none dark:text-white"
                }`}
            >
              {num}
            </PaginationItem>
          ))}

          <PaginationItem onClick={() => handlePageChange(pageParams + 1)}>
            <Button variant={'ghost'}>
              Next
              <ChevronRight size={16} />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default SearchResultsPagination;
