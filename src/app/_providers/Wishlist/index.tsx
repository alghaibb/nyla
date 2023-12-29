'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'

import { Product, User } from '../../../payload/payload-types'
import { useAuth } from '../Auth'
import { WishlistItem, wishlistReducer } from './reducer'

export type WishlistContext = {
  wishlist: User['wishlist']
  addItemToWishlist: (item: WishlistItem) => void
  deleteItemFromWishlist: (product: Product) => void
  wishlistIsEmpty: boolean | undefined
  clearWishlist: () => void
  isProductInWishlist: (product: Product) => boolean
  wishlistTotal: {
    formatted: string
    raw: number
  }
  hasInitializedWishlist: boolean
}

const Context = createContext({} as WishlistContext)

export const useWishlist = () => useContext(Context)

const arrayHasItems = array => Array.isArray(array) && array.length > 0

// Step 1: Check local storage for a wishlist
// Step 2: If there is a wishlist, fetch the products and hydrate the wishlist
// Step 3: Authenticate the user
// Step 4: If the user is authenticated, merge the user's wishlist with the local wishlist
// Step 4B: Sync the wishlist to Payload and clear local storage
// Step 5: If the user is logged out, sync the wishlist to local storage only

export const WishlistProvider = props => {
  const { children } = props
  const { user, status: authStatus } = useAuth()

  const [wishlist, dispatchWishlist] = useReducer(wishlistReducer, {
    items: [],
  })

  const [total, setTotal] = useState<{
    formatted: string
    raw: number
  }>({
    formatted: '0.00',
    raw: 0,
  })

  const hasInitialized = useRef(false)
  const [hasInitializedWishlist, setHasInitializedWishlist] = useState(false)

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true

      const syncWishlistFromLocalStorage = async () => {
        const localWishlist = localStorage.getItem('wishlist')

        const parsedWishlist = JSON.parse(localWishlist || '{}')

        if (parsedWishlist?.items && parsedWishlist?.items.length > 0) {
          const initailWishlist = await Promise.all(
            parsedWishlist.items.map(async ({ product, quantity }) => {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`)
              const data = await res.json()
              return {
                product: data,
                quantity,
              }
            }),
          )

          dispatchWishlist({
            type: 'SET_WISHLIST',
            payload: {
              items: initailWishlist,
            },
          })
        } else {
          dispatchWishlist({
            type: 'SET_WISHLIST',
            payload: {
              items: [],
            },
          })
        }
      }

      syncWishlistFromLocalStorage()
    }
  }, [])

  useEffect(() => {
    if (!hasInitialized.current) return

    if (authStatus === 'loggedIn') {
      dispatchWishlist({
        type: 'MERGE_WISHLIST',
        payload: user?.wishlist,
      })
    }

    if (authStatus === 'loggedOut') {
      dispatchWishlist({
        type: 'CLEAR_WISHLIST',
      })
    }
  }, [authStatus, user])

  useEffect(() => {
    if (!hasInitialized.current || user === undefined) return

    const flattenWishlist = {
      ...wishlist,
      items: wishlist?.items
        ?.map(item => {
          if (!item?.product || typeof item?.product !== 'object') {
            return null
          }

          return {
            ...item,
            product: item?.product?.id,
            quantity: typeof item?.quantity === 'number' ? item?.quantity : 0,
          }
        })
        .filter(Boolean) as WishlistItem[],
    }

    if (user) {
      try {
        const syncWishlistToPayload = async () => {
          const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify({
              cart: flattenWishlist,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (req.ok) {
            localStorage.setItem('wishlist', '[]')
          }
        }

        syncWishlistToPayload()
      } catch (e) {
        console.error('Error syncing wishlist to Payload')
      }
    } else {
      localStorage.setItem('wishlist', JSON.stringify(flattenWishlist))
    }

    setHasInitializedWishlist(true)
  }, [user, wishlist])

  const isProductInWishlist = useCallback(
    (incomingProduct: Product): boolean => {
      let isInWishlist = false
      const { items: itemsInWishlist } = wishlist || {}
      if (Array.isArray(itemsInWishlist) && itemsInWishlist.length > 0) {
        isInWishlist = Boolean(
          itemsInWishlist.find(({ product }) =>
            typeof product === 'string'
              ? product === incomingProduct.id
              : product?.id === incomingProduct.id,
          ), // eslint-disable-line function-paren-newline
        )
      }
      return isInWishlist
    },
    [wishlist],
  )

  const addItemToWishlist = useCallback(incomingItem => {
    dispatchWishlist({
      type: 'ADD_ITEM',
      payload: incomingItem,
    })
  }, [])

  const deleteItemFromWishlist = useCallback((incomingProduct: Product) => {
    dispatchWishlist({
      type: 'DELETE_ITEM',
      payload: incomingProduct,
    })
  }, [])

  const clearWishlist = useCallback(() => {
    dispatchWishlist({
      type: 'CLEAR_WISHLIST',
    })
  }, [])

  useEffect(() => {
    if (!hasInitialized) return

    const newTotal =
      wishlist?.items?.reduce((acc, item) => {
        return (
          acc +
          (typeof item.product === 'object'
            ? JSON.parse(item?.product?.priceJSON || '{}')?.data?.[0]?.unit_amount *
              (typeof item?.quantity === 'number' ? item?.quantity : 0)
            : 0)
        )
      }, 0) || 0

    setTotal({
      formatted: (newTotal / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'AUD',
      }),
      raw: newTotal,
    })
  }, [wishlist, hasInitialized])

  return (
    <Context.Provider
      value={{
        wishlist,
        addItemToWishlist,
        deleteItemFromWishlist,
        wishlistIsEmpty: hasInitialized && !arrayHasItems(wishlist?.items),
        clearWishlist,
        isProductInWishlist,
        wishlistTotal: total,
        hasInitializedWishlist,
      }}
    >
      {children && children}
    </Context.Provider>
  )
}
