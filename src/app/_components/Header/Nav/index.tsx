'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Header as HeaderType } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'
import { Button } from '../../Button'

import classes from './index.module.scss'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  const navItems = header?.navItems || []

  const { user } = useAuth()

  const closeNav = () => {
    setIsNavOpen(false)
  }

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  // Close the nav if clicking outside of it
  useEffect(() => {
    const closeNav = (e: MouseEvent) => {
      const target = e.target as Element
      if (isNavOpen && !target.closest(`.${classes.nav}`)) {
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

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768)
    // Set the initial value
    handleResize()
    // Add event listener
    window.addEventListener('resize', handleResize)
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const desktopNavItems = [
    { label: 'Shop', url: '/products' },
    { label: 'Cart', url: '/cart' },
  ]

  const mobileNavItems = [
    { label: 'Shop', url: '/products' },
    { label: 'Cart', url: '/cart' },
  ]

  return (
    <>
      <button className={classes.hamburger} onClick={toggleNav}>
        <div className={classes.iconLine}></div>
        <div className={classes.iconLine}></div>
        <div className={classes.iconLine}></div>
      </button>

      <div className={`${classes.navBackdrop} ${isNavOpen ? classes.isOpen : ''}`}></div>

      <nav className={`${classes.nav} ${isNavOpen ? classes.isOpen : ''}`}>
        {isNavOpen && (
          <div className={classes.closeIcon} onClick={toggleNav}>
            &times;
          </div>
        )}
        {isDesktop
          ? desktopNavItems.map((item, i) => (
              // Render desktop links
              <Link key={i} href={item.url} onClick={closeNav}>
                {item.label}
              </Link>
            ))
          : mobileNavItems.map((item, i) => (
              // Render mobile links
              <Link key={i} href={item.url} onClick={closeNav}>
                <span className={classes.mobileSpanText}>{item.label}</span>
              </Link>
            ))}
        <div className={classes.accountLgScreen}>
          {user && (
            <Link href="/account" onClick={closeNav}>
              Account
            </Link>
          )}
        </div>
        {!user && (
          <div className={`${classes.buttonForLargeScreen}`}>
            <Button
              el="link"
              href="/login"
              label="Login"
              appearance="primary"
              onClick={() => {
                closeNav()
                window.location.href = '/login'
              }}
              className={classes.navButton}
            />
          </div>
        )}
        {isNavOpen && (
          <div className={`${classes.userIconContainer}`}>
            {user ? (
              <Link href="/logout" onClick={closeNav}>
                <Image src="/assets/icons/logout.svg" alt="logout" width={20} height={20} />
                <span className={classes.spanText}>Logout</span>
              </Link>
            ) : (
              <Link href="/login" onClick={closeNav}>
                <Image src="/assets/icons/user.svg" alt="user" width={20} height={20} />
                <span className={classes.spanText}>Login</span>
              </Link>
            )}
            <div className={classes.linkGroup}>
              {user && (
                <div className={classes.accountLink}>
                  <Link href="/account" onClick={closeNav}>
                    <Image src="/assets/icons/account.svg" alt="account" width={20} height={20} />
                    <span className={classes.spanText}>Account</span>
                  </Link>
                </div>
              )}
              <Link href="/contact" onClick={closeNav}>
                <div className={classes.contactLink}>
                  <Image src="/assets/icons/contact.svg" alt="contact" width={20} height={20} />
                  <span className={classes.spanText}>Contact Us</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
