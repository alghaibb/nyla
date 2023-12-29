/* eslint-disable function-paren-newline */
/* eslint-disable prettier/prettier */
import type { Product, User, WishlistItems } from '../../../payload/payload-types'

export type WishlistItem = WishlistItems[0]

type WishlistType = User['wishlist']

type WishlistAction =
  | {
    type: 'SET_WISHLIST'
    payload: WishlistType
  }
  | {
    type: 'ADD_ITEM'
    payload: WishlistItem
  }
  | {
    type: 'DELETE_ITEM'
    payload: Product
  }
  | {
    type: 'CLEAR_WISHLIST'
  }

export const wishlistReducer = (wishlist: WishlistType, action: WishlistAction): WishlistType => {
  switch (action.type) {
    case 'SET_WISHLIST': {
      return action.payload
    }

    case 'ADD_ITEM': {
      const { payload: item } = action

      const productId = typeof item.product === 'string' ? item.product : item?.product?.id

      const indexInWishlist = wishlist?.items?.findIndex(({ product }) =>
        typeof product === 'string' ? product === productId : product?.id === productId,
        // eslint-disable-next-line function-paren-newline
      )

      let withAddedItem = [...(wishlist?.items || [])]

      if (indexInWishlist > -1) {
        withAddedItem.push(item)
      }

      return {
        ...wishlist,
        items: withAddedItem,
      }
    }

    case 'DELETE_ITEM': {
      const { payload: incomingProduct } = action
      const deletedItem = { ...wishlist }

      const indexInWishlist = wishlist?.items?.findIndex(({ product }) =>
        typeof product === 'string'
          ? product === incomingProduct.id
          : product?.id === incomingProduct.id,
      )

      if (typeof indexInWishlist === 'number' && deletedItem.items && indexInWishlist > -1)
        deletedItem.items.splice(indexInWishlist, 1)

      return deletedItem
    }

    case 'CLEAR_WISHLIST': {
      return {
        ...wishlist,
        items: [],
      }
    }

    default: {
      return wishlist
    }
  }
}
