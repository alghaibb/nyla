'use client'

import React, { useEffect, useState } from 'react'

import { Chevron } from '../Chevron'

import classes from './index.module.scss'

export const Pagination: React.FC<{
  page: number
  totalPages: number
  itemsCount: number
  onClick: (page: number) => void
  className?: string
}> = props => {
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const { page, totalPages, itemsCount, onClick, className } = props

  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const isMobile = window.innerWidth < 768

  useEffect(() => {
    // Prevent scroll on initial load
    if (isInitialLoad) {
      setIsInitialLoad(false)
      return
    }
    // Check if it's not the last page or if it's the last page with more than one item
    if (!(page === totalPages && itemsCount === 1)) {
      const scrollOptions: ScrollToOptions = {
        top: isMobile ? 100 : 0,
        behavior: 'smooth',
      }
      window.scrollTo(scrollOptions)
    }
  }, [page, totalPages, itemsCount]) // Effect runs when these values change

  const handleNextPageClick = () => {
    onClick(page + 1)
  }

  return (
    <div className={[classes.pagination, className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className={classes.button}
        disabled={!hasPrevPage}
        onClick={() => {
          onClick(page - 1)
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
