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
    type: 'MERGE_WISHLIST'
    payload: WishlistType
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

    case 'MERGE_WISHLIST': {
      const { payload: incomingWishlist } = action

      const syncedItems: WishlistItem[] = [
        ...(wishlist?.items || []),
        ...(incomingWishlist?.items || []),
      ].reduce((acc: WishlistItem[], item) => {
        const productId = typeof item.product === 'string' ? item.product : item?.product?.id

        const indexInAcc = acc.findIndex(({ product }) =>
          typeof product === 'string' ? product === productId : product?.id === productId,
        )

        if (indexInAcc > -1) {
          acc[indexInAcc] = {
            ...acc[indexInAcc],
            // customize the merge logic here, e.g.:
            // quantity: acc[indexInAcc].quantity + item.quantity
          }
        } else {
          acc.push(item)
        }
        return acc
      }, [])

      return {
        ...wishlist,
        items: syncedItems,
      }
    }

    case 'ADD_ITEM': {
      const { payload: item } = action

      const productId = typeof item.product === 'string' ? item.product : item?.product?.id

      const indexInWishlist = wishlist?.items?.findIndex(({ product }) =>
        typeof product === 'string' ? product === productId : product?.id === productId,
        // eslint-disable-next-line function-paren-newline
      )

      let withAddedItem = [...(wishlist?.items || [])]

      if (indexInWishlist === -1) {
        withAddedItem.push(item)
      }

      return {
        ...wishlist,
        items: withAddedItem,
      }
    }

    case 'DELETE_ITEM': {
      const { payload: incomingProduct } = action;

      // Create a deep copy of wishlist
      const deletedItem = {
        ...wishlist,
        items: wishlist.items ? [...wishlist.items] : [],
      };

      const indexInWishlist = deletedItem.items.findIndex(({ product }) =>
        typeof product === 'string'
          ? product === incomingProduct.id
          : product?.id === incomingProduct.id,
      );

      if (typeof indexInWishlist === 'number' && indexInWishlist > -1) {
        // Create a new array without the deleted item
        deletedItem.items = [
          ...deletedItem.items.slice(0, indexInWishlist),
          ...deletedItem.items.slice(indexInWishlist + 1),
        ];
      }

      return deletedItem;
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
