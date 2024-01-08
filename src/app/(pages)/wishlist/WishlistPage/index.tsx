'use client'

import React, { Fragment, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Page, Settings } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import Modal from '../../../_components/Modal'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'
import { useWishlist } from '../../../_providers/Wishlist'
import WishlistItem from './WishlistItem'

import classes from './index.module.scss'

export const WishlistPage: React.FC<{
  settings: Settings
  page: Page
}> = props => {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)

  const { settings } = props
  const { productsPage } = settings || {}
  const { user } = useAuth()
  const router = useRouter()
  const { addToast } = useToasts()

  const {
    wishlist,
    wishlistIsEmpty,
    addItemToWishlist,
    wishlistTotal,
    hasInitializedWishlist,
    clearWishlist,
  } = useWishlist()
  const { addItemToCart } = useCart()

  const handleAddAllToCart = () => {
    wishlist?.items?.forEach(item => {
      if (typeof item.product === 'object') {
        const { quantity, product } = item
        addItemToCart({
          product,
          quantity,
        })
      }
    })

    const redirectPath = user ? '/cart' : '/login?redirect=%2Fcart'
    router.push(redirectPath)

    addToast('All items in your wishlist have been added to your cart', {
      appearance: 'success',
      autoDismiss: true,
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    })
  }

  const removeAllFromWishlist = () => {
    setIsRemoveModalOpen(true)
  }

  const confirmRemoveAllFromWishlist = () => {
    clearWishlist()
    setIsRemoveModalOpen(false)
  }

  const closeModal = () => {
    setIsRemoveModalOpen(false)
  }

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
              <p>Your wishlist is currently empty.</p>
              {!user && <Fragment></Fragment>}
            </div>
          ) : (
            <div>
              {/* WISHLIST LIST HEADER */}
              <div className={classes.header}>
                <p>Products</p>
                <div className={classes.headerItemDetails}></div>
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
                        addItemToCart={addItemToCart}
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
                  className={classes.addToCartButton}
                  onClick={handleAddAllToCart}
                  label={'Add All to Cart'}
                  appearance="primary"
                />
                <Button
                  className={classes.addToCartButton}
                  onClick={removeAllFromWishlist}
                  label={'Remove All From Wishlist'}
                  appearance="primary"
                />

                <Modal
                  isOpen={isRemoveModalOpen}
                  title="Remove All Items"
                  content="Are you sure you want to remove all items from your wishlist?"
                  closeModal={closeModal}
                  confirmAction={confirmRemoveAllFromWishlist}
                />
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}
