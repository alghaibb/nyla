'use client'

import React, { useState } from 'react'
import { set, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { Button } from '../../../_components/Button'
import { Input } from '../../../_components/Input'
import { Message } from '../../../_components/Message'

import classes from './index.module.scss'

type FormData = {
  name: string
  email: string
  message: string
  orderID?: string
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/form-submissions', {
        body: JSON.stringify({ ...data }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
      })

      reset()
      setIsSubmitting(false)

      if (res.status === 201) {
        setFormSubmitted(true)
      } else {
        toast.error('Something went wrong, please try again')
      }
    } catch (error) {
      setIsSubmitting(false)
      toast.error('An error occurred, please try again')
    }
  }

  if (formSubmitted) {
    return (
      <div className={classes.thankYouMessage}>
        <p>
          Thank you for contacting us. We have received your message and will get back to you as
          soon as we can.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Message error={error} className={classes.message} />
      <Input
        name="orderID"
        label="Order ID (optional)"
        register={register}
        error={errors.orderID}
        type="text"
        disabled={isSubmitting}
      />
      <Input
        name="name"
        label="Full Name"
        required
        register={register}
        error={errors.name}
        type="text"
        disabled={isSubmitting}
      />
      <Input
        name="email"
        label="Email Address"
        required
        register={register}
        error={errors.email}
        type="email"
        disabled={isSubmitting}
      />
      <Input
        name="message"
        label="Your Message"
        required
        register={register}
        error={errors.message}
        type="text"
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        label="Send Message"
        appearance="primary"
        className={classes.submit}
        disabled={isSubmitting}
      />
    </form>
  )
}
