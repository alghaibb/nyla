import type { CollectionConfig } from 'payload/types'

const FormSubmission: CollectionConfig = {
  slug: 'form-submissions',
  access: {
    create: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        // Send an email to the client
        // with the content of the message
      },
    ],
  },
  fields: [
    {
      type: 'text',
      name: 'orderID',
      label: 'Order ID',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'text',
      name: 'email',
      label: 'From Email',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'textarea',
      name: 'message',
      label: 'Message',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'text',
      name: 'source',
      label: 'Source',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}

export default FormSubmission
