import React, { useEffect } from 'react'

import { Button } from '../Button'

interface ModalProps {
  isOpen: boolean
  title: string
  content: React.ReactNode
  closeModal: () => void
  confirmAction: () => void
}

import classes from './index.module.scss'

const Modal: React.FC<ModalProps> = ({ isOpen, title, content, closeModal, confirmAction }) => {
  useEffect(() => {
    const body = document.body

    if (isOpen) {
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = 'unset'
    }

    return () => {
      body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <div className={classes.modalOverlay} onClick={closeModal}>
          <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
            <div className={classes.modalHeader}>
              <button className={classes.closeButton} onClick={closeModal}>
                X
              </button>
            </div>
            <div>{content}</div>
            <Button
              onClick={confirmAction}
              className={classes.confirmButton}
              label="Confirm"
              appearance="primary"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
