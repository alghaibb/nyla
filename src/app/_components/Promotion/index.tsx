'use client'

import React, { useEffect, useState } from 'react'

import classes from './index.module.scss'

const Promotion = () => {
  // const [time, setTime] = useState({
  //   days: 0,
  //   hours: 0,
  //   minutes: 0,
  //   seconds: 0,
  // })

  // const targetDate = new Date()
  // targetDate.setDate(targetDate.getDate() + 7)

  // useEffect(() => {
  //   const timerInterval = setInterval(() => {
  //     const currentTime = new Date()
  //     const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0)

  //     const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  //     const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  //     const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
  //     const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

  //     setTime({ days, hours, minutes, seconds })

  //     if (timeDifference === 0) {
  //       clearInterval(timerInterval)
  //     }
  //   }, 1000)

  //   return () => {
  //     clearInterval(timerInterval)
  //   }
  // }, [])

  return (
    <section className={classes.promotion}>
      <div className={classes.textBox}>
        <h3 className={classes.title}>Featured Collection</h3>
        <p>
          Explore our Featured Collection, a showcase of elegance where tradition and modernity
          converge. Each piece is a testament to sophisticated design, offering a seamless blend of
          style and comfort. Perfect for the discerning individual, this collection is about
          celebrating your unique identity with timeless elegance.
        </p>
        {/* <ul className={classes.stats}>
          <StatBox label="Days" value={time.days} />
          <StatBox label="Hours" value={time.hours} />
          <StatBox label="Minutes" value={time.minutes} />
          <StatBox label="Seconds" value={time.seconds} />
        </ul> */}
      </div>
    </section>
  )
}

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className={classes.statBox}>
    <h4>{value}</h4>
    <p>{label}</p>
  </li>
)

export default Promotion
