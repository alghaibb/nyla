import React from 'react'

import { Chevron } from '../Chevron'

import classes from './index.module.scss'

export const Pagination: React.FC<{
  page: number
  totalPages: number
  onClick: (page: number) => void
  className?: string
}> = props => {
  const { page, totalPages, onClick, className } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const handleNextPageClick = () => {
    onClick(page + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={[classes.pagination, className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className={classes.button}
        disabled={!hasPrevPage}
        onClick={() => {
          onClick(page - 1)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        <Chevron rotate={90} className={classes.icon} />
      </button>
      <div className={classes.pageRange}>
        <span className={classes.pageRangeLabel}>
          Page {page} of {totalPages}
        </span>
      </div>
      <button
        type="button"
        className={classes.button}
        disabled={!hasNextPage}
        onClick={handleNextPageClick}
      >
        <Chevron rotate={-90} className={classes.icon} />
      </button>
    </div>
  )
}
