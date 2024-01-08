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
  isProductInWishlist: (product: Product) => boolean
  wishlistTotal: {
    formatted: string
    raw: number
  }
  hasInitializedWishlist: boolean
  clearWishlist: () => void
}

const Context = createContext({} as WishlistContext)

export const useWishlist = () => useContext(Context)

const arrayHasItems = array => Array.isArray(array) && array.length > 0

export const WishlistProvider = props => {
  const { children } = props
  const { user, status: authStatus } = useAuth()

  const [wishlistCreationTime, setWishlistCreationTime] = useState<number | null>(null)

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
        console.log('Local Wishlist:', localWishlist)

        const parsedWishlist = JSON.parse(localWishlist || '{}')

        if (parsedWishlist?.items && parsedWishlist?.items.length > 0) {
          const initialWishlist = await Promise.all(
            parsedWishlist.items.map(async ({ product, quantity }) => {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.slug}`)
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
              items: initialWishlist,
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
    } else if (authStatus === 'loggedOut') {
      const now = Date.now()
      const oneWeek = 7 * 24 * 60 * 60 * 1000

      if (wishlistCreationTime && now - wishlistCreationTime > oneWeek) {
        clearWishlist()
        setWishlistCreationTime(null)
      }
    }
  }, [authStatus, user, wishlistCreationTime])

  const prevWishlist = useRef(wishlist)

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
              wishlist: flattenWishlist,
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

  const clearWishlist = () => {
    dispatchWishlist({ type: 'CLEAR_WISHLIST' })
  }

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
        isProductInWishlist,
        wishlistTotal: total,
        hasInitializedWishlist,
        clearWishlist,
      }}
    >
      {children && children}
    </Context.Provider>
  )
}
