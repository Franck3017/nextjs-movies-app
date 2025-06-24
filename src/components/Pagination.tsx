type PaginationProps = {
  page: number
  total: number
  onPrev: () => void
  onNext: () => void
}

export default function Pagination({ page, total, onPrev, onNext }: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-4 py-6">
      <button onClick={onPrev} disabled={page === 1} className="btn-cine">« Anterior</button>
      <span>Página <strong>{page}</strong> de <strong>{total}</strong></span>
      <button onClick={onNext} disabled={page === total} className="btn-cine">Siguiente »</button>
    </div>
  )
}