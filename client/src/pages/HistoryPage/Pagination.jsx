import {
  Pagination as PaginationWrapper,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationButton,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Pagination({ offest, setOffest, limit, total_pages }) {
  const currentPage = offest / limit + 1;
  const pageSkip = currentPage * limit - limit;

  return (
    <PaginationWrapper className="mt-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setOffest(pageSkip - limit)}
            disabled={currentPage === 1}
          />
        </PaginationItem>
        {Array.from({ length: total_pages }, (_, index) => (
          <PaginationItem key={index}>
            <PaginationButton
              onClick={() => setOffest(index * limit)}
              isActive={currentPage - 1 === index}
              disabled={currentPage - 1 === index}
            >
              {index + 1}
            </PaginationButton>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            disabled={currentPage === total_pages}
            onClick={() => setOffest(pageSkip + limit)}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationWrapper>
  );
}
