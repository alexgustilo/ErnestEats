function AdminPagination({ total, page, pageSize = 10, onPageChange }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1 py-2">
      <p className="text-sm text-[#8A7A61]">
        Showing <span className="font-semibold text-[#2B211A]">{first}–{last}</span>
        <span className="mx-1.5 text-[#C3B59F]">/</span>
        <span className="font-semibold text-[#2B211A]">{total}</span> items
      </p>
      {pageCount > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#756957] transition hover:bg-[#F2ECDD] hover:text-[#2B211A] disabled:cursor-not-allowed disabled:text-[#C3B59F]"
          >
            <span aria-hidden="true" className="mr-1">←</span>Previous
          </button>
          <span aria-current="page" className="min-w-24 rounded-lg bg-[#2B211A] px-3 py-2 text-center text-xs font-bold tracking-wide text-white">
            {page} <span className="mx-1 font-medium text-white/50">/</span> {pageCount}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(pageCount, page + 1))}
            disabled={page >= pageCount}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#756957] transition hover:bg-[#F2ECDD] hover:text-[#2B211A] disabled:cursor-not-allowed disabled:text-[#C3B59F]"
          >
            Next<span aria-hidden="true" className="ml-1">→</span>
          </button>
        </nav>
      )}
    </div>
  )
}

export default AdminPagination
