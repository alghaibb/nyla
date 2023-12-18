'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Category } from '../../../payload/payload-types'
import { useFilter } from '../../_providers/Filter'
import CategoryCard from './CategoryCard'

import classes from './index.module.scss'

const Categories = ({ categories }: { categories: Category[] }) => {
  const { setCategoryFilters } = useFilter()
  const router = useRouter()

  const handleShowAll = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setCategoryFilters([])
    router.push('/products')
  }

  return (
    <section className={classes.container}>
      <div className={classes.titleWrapper}>
        <h3>Shop by Categories</h3>
        <Link href="/products" onClick={handleShowAll}>
          <span className={classes.span}>Show All</span>
        </Link>
      </div>

      <div className={classes.list}>
        {categories.map(category => {
          return <CategoryCard key={category.id} category={category} />
        })}
      </div>
    </section>
  )
}

export default Categories
