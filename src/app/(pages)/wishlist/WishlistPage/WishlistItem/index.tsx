'use client'

import React, { useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import Image from 'next/image'
import Link from 'next/link'

import { Product } from '../../../../../payload/payload-types'
import { Media } from '../../../../_components/Media'
import { Price } from '../../../../_components/Price'
import { RemoveFromWishlistButton } from '../../../../_components/RemoveFromWishlistButton'
import { useCart } from '../../../../_providers/Cart'

import classes from './index.module.scss'

interface WishlistItemProps {
  product: Product
  title: string
  metaImage: string | Media
  qty: number
  addItemToWishlist: (item: { product?: string | Product; quantity?: number; id?: string }) => void
  addItemToCart: (item: { product?: string | Product; quantity?: number; id?: string }) => void
}

const WishlistItem: React.FC<WishlistItemProps> = ({ product, title, metaImage, qty }) => {
  const { addItemToCart } = useCart()
  const { addToast } = useToasts()

  const [quantity, setQuantity] = useState(qty)
  const [addedToCart, setAddedToCart] = useState(false)

  const addToCartIndividualItem = () => {
    addItemToCart({
      product,
      quantity: 1,
    })

    setAddedToCart(true)

    addToast(`${quantity} ${product.title} has been added to your cart`, {
      appearance: 'success',
      autoDismiss: true,
      style: {
        borderRadius: 10,
        background: '#333',
        color: '#fff',
      },
    })
  }

  return (
    <li className={classes.item} key={title}>
      <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
        {!metaImage && <span>No image</span>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media className={classes.media} imgClassName={classes.image} resource={metaImage} fill />
        )}
      </Link>

      <div className={classes.itemDetails}>
        <div className={classes.titleWrapper}>
          <h6>{title}</h6>
          <Price product={product} button={false} />
        </div>
      </div>
      <div className={classes.subtotalWrapper}>
        <div className={classes.addToCartButton} onClick={addToCartIndividualItem}>
          <Image
            src="/assets/icons/add-to-cart.png"
            alt="add-to-cart"
            width={26}
            height={26}
            className={classes.addToCartIcon}
          />
        </div>
        <RemoveFromWishlistButton product={product} className={classes.removeFromWishlistButton} />
        <Price product={product} button={false} quantity={quantity} />
      </div>
    </li>
  )
}

export default WishlistItem
