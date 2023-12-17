'use client'

import React from 'react'
import { ToastContainer } from 'react-toastify'

import ContactForm from './ContactForm'

import 'react-toastify/dist/ReactToastify.css'

import classes from './index.module.scss'

export default function Contact() {
  return (
    <section className={classes.contact}>
      <div className={classes.formWrapper}>
        <div className={classes.formContainer}>
          <div className={classes.formTitle}>
            <h3>Contact Us</h3>
          </div>

          <p>We would love to hear from you!</p>
          <ToastContainer autoClose={3000} hideProgressBar={true} />
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
