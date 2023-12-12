'use client'

import React from 'react'
import Link from 'next/link'

import { Category, Media } from '../../../../payload/payload-types'
import { useFilter } from '../../../_providers/Filter'

import classes from './index.module.scss'

type CategoryCardProps = {
  category: Category
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const media = category.media as Media
  const { setCategoryFilters } = useFilter()

  const handleClick = e => {
    e.preventDefault()
    setCategoryFilters([category.id])
    window.location.href = '/products'
  }

  return (
    <div className={classes.card} onClick={handleClick}>
      <Link href="/products">
        <div className={classes.cardImage} style={{ backgroundImage: `url(${media.url})` }} />
      </Link>
      <Link href="/products">
        <p className={classes.title}>{category.title}</p>
      </Link>
    </div>
  )
}

export default CategoryCard
