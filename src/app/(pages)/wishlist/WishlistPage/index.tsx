'use client'

import React, { Fragment } from 'react'
import Link from 'next/link'

import { Page, Settings } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import { useAuth } from '../../../_providers/Auth'
import { useWishlist } from '../../../_providers/Wishlist'
import WishlistItem from './WishlistItem'

import classes from './index.module.scss'

export const WishlistPage: React.FC<{
  settings: Settings
  page: Page
}> = props => {
  const { settings } = props
  const { productsPage } = settings || {}

  const { user } = useAuth()

  const { wishlist, wishlistIsEmpty, addItemToWishlist, wishlistTotal, hasInitializedWishlist } =
    useWishlist()

  return (
    <Fragment>
      <br />
      {!hasInitializedWishlist ? (
        <div className={classes.loading}>
          <LoadingShimmer />
        </div>
      ) : (
        <Fragment>
          {wishlistIsEmpty ? (
            <div className={classes.empty}>
              Your wishlist is empty.
              {typeof productsPage === 'object' && productsPage?.slug && (
                <Fragment>
                  {' '}
                  <Link href={`/${productsPage.slug}`}>Click here</Link>
                  {` to shop.`}
                </Fragment>
              )}
              {!user && (
                <Fragment>
                  {' '}
                  <Link href={`/login?redirect=%2Fwishlist`}>Login</Link>
                  {` to view a saved wishlist.`}
                </Fragment>
              )}
            </div>
          ) : (
            <div>
              {/* WISHLIST LIST HEADER */}
              <div className={classes.header}>
                <p>Products</p>
                <div className={classes.headerItemDetails}>
                  <p></p>
                  <p></p>
                  <p>Quantity</p>
                </div>
                <p className={classes.headersubtotal}>Subtotal</p>
              </div>
              {/* WISHLIST ITEM LIST */}
              <ul className={classes.itemsList}>
                {wishlist?.items?.map((item, index) => {
                  if (typeof item.product === 'object') {
                    const {
                      quantity,
                      product,
                      product: { id, title, meta, stripeProductID },
                    } = item

                    const isLast = index === (wishlist?.items?.length || 0) - 1

                    const metaImage = meta?.image

                    return (
                      <WishlistItem
                        key={id}
                        product={product}
                        title={title}
                        metaImage={metaImage}
                        qty={quantity}
                        addItemToWishlist={addItemToWishlist}
                      />
                    )
                  }
                  return null
                })}
              </ul>

              <div className={classes.summary}>
                <div className={classes.row}>
                  <h6 className={classes.wishlistTotal}>Summary</h6>
                </div>

                <div className={classes.row}>
                  <p className={classes.wishlistTotal}>Total</p>
                  <p className={classes.wishlistTotal}>{wishlistTotal.formatted}</p>
                </div>

                <Button
                  className={classes.checkoutButton}
                  href={user ? '/checkout' : '/login?redirect=%2Fcheckout'}
                  label={user ? 'Checkout' : 'Login to checkout'}
                  appearance="primary"
                />
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}
