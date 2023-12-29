import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Page, Settings } from '../../../payload/payload-types'
import { fetchDoc } from '../../_api/fetchDoc'
import { fetchSettings } from '../../_api/fetchGlobals'
import { Blocks } from '../../_components/Blocks'
import { Gutter } from '../../_components/Gutter'
import { generateMeta } from '../../_utilities/generateMeta'
import { WishlistPage } from './WishlistPage'

import classes from './index.module.scss'

export const dynamic = 'force-dynamic'

export default async function Wishlist() {
  let page: Page | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug: 'wishlist',
    })
  } catch (error) {
    console.error(error)
  }

  if (!page) {
    return notFound()
  }

  let settings: Settings | null = null

  try {
    settings = await fetchSettings()
  } catch (error) {
    console.error(error)
  }

  return (
    <div className={classes.container}>
      <Gutter>
        <h3>Wishlist</h3>
        <WishlistPage settings={settings} page={page} />
      </Gutter>
      <Blocks blocks={page?.layout} disableBottomPadding />
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  let page: Page | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug: 'wishlist',
    })
  } catch (error) {
    console.error(error)
  }

  if (!page) {
    return notFound()
  }

  return generateMeta({ doc: page })
}
