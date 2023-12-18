'use client'

import React, { useEffect, useState } from 'react'
import { Twirl as Hamburger } from 'hamburger-react'
import Image from 'next/image'
import Link from 'next/link'

import { Header as HeaderType } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'
import { Button } from '../../Button'
import { CartLink } from '../../CartLink'
import { CMSLink } from '../../Link'

import classes from './index.module.scss'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const navItems = header?.navItems || []
  const { user } = useAuth()

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  // Close the nav if clicking outside of it
  useEffect(() => {
    const closeNav = e => {
      if (isNavOpen && !e.target.closest(`.${classes.nav}`)) {
        setIsNavOpen(false)

        // Enable scrolling on the body when the menu is closed
        document.body.style.overflow = 'auto'
      }
    }

    document.addEventListener('click', closeNav)
    return () => document.removeEventListener('click', closeNav)
  }, [isNavOpen])

  // Disable scrolling on the body when the menu is open
  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isNavOpen])

  return (
    <>
      <button className={classes.hamburger} onClick={toggleNav}>
        <Hamburger toggled={isNavOpen} toggle={setIsNavOpen} size={24} />
      </button>

      <nav className={`${classes.nav} ${isNavOpen ? classes.isOpen : ''}`}>
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="none" />
        })}
        <CartLink />
        {user && <Link href="/account">Account</Link>}
        {!user && (
          <div className={`${classes.buttonForLargeScreen}`}>
            <Button
              el="link"
              href="/login"
              label="Login"
              appearance="primary"
              onClick={() => (window.location.href = '/login')}
              className={classes.navButton}
            />
          </div>
        )}

        {isNavOpen && (
          <div className={`${classes.userIconContainer}`}>
            {user ? (
              <>
                <Link href="/logout">
                  <Image src="/assets/icons/logout.svg" alt="logout" width={24} height={24} />
                  <span className={classes.spanText}>Logout</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Image src="/assets/icons/user.svg" alt="user" width={24} height={24} />
                  <span className={classes.spanText}>Login</span>
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
