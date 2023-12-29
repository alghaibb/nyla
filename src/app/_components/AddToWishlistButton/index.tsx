'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Product } from '../../../payload/payload-types'
import { useWishlist } from '../../_providers/Wishlist'
import { Button, Props } from '../Button'

import classes from './index.module.scss'

export const AddToWishlistButton: React.FC<{
  product: Product
  quantity?: number
  className?: string
  appearance?: Props['appearance']
}> = props => {
  const { product, quantity = 1, className, appearance = 'primary' } = props

  const { wishlist, addItemToWishlist, isProductInWishlist, hasInitializedWishlist } = useWishlist()

  const [isInWishlist, setIsInWishlist] = useState<boolean>()
  const router = useRouter()

  useEffect(() => {
    setIsInWishlist(isProductInWishlist(product))
  }, [isProductInWishlist, product, wishlist])

  return (
    <Button
      href={isInWishlist ? '/wishlist' : undefined}
      type={!isInWishlist ? 'button' : undefined}
      label={isInWishlist ? `✓ View in wishlist` : `Add to wishlist`}
      el={isInWishlist ? 'link' : undefined}
      appearance={appearance}
      className={[
        className,
        classes.addToWishlistButton,
        appearance === 'default' && isInWishlist && classes.green,
        !hasInitializedWishlist && classes.hidden,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={
        !isInWishlist
          ? () => {
              addItemToWishlist({
                product,
                quantity,
              })

              router.push('/wishlist')
            }
          : undefined
      }
    />
  )
}
