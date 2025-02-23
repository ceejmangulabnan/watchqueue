import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SearchResultsPagination = ({ totalPages }: { totalPages: number | undefined }) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query");
  const pageParams = Number(searchParams.get("page")) || 1; // Default to page 1
  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    navigate(`/search/multi?query=${searchQuery}&page=${newPage}`);
  };
  const pageNumbers = [];
  const range = 2; // Number of pages to show before and after current page

  for (let i = Math.max(1, pageParams - range); i <= Math.min(totalPages ?? 0, pageParams + range); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='my-6'>
      <Pagination>
        <PaginationContent>
          <PaginationItem
            className={pageParams <= 1 ? 'hidden' : ''}
            onClick={() => handlePageChange(pageParams - 1)}>
            <Button>
              <PaginationPrevious />

            </Button>
          </PaginationItem>


          {/* Page Numbers */}
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
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default SearchResultsPagination;
