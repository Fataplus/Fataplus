import type { CollectionConfig } from '@sonicjs-cms/core'

export const storeCollection: CollectionConfig = {
  name: 'store',
  displayName: 'Store',
  description: 'Store items',
  schema: {
    type: 'object',
    required: ['title'],
    properties: {
      price: { type: 'string', title: 'Price' },
      title: { type: 'string', title: 'Title' },
      checkout: { type: 'string', title: 'Checkout URL' },
      license: { type: 'string', title: 'License' },
      highlights: {
        type: 'array',
        title: 'Highlights',
        items: { type: 'string' }
      },
      specifications: {
        type: 'array',
        title: 'Specifications',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', title: 'Name' },
            value: { type: 'string', title: 'Value' }
          }
        }
      },
      description: { type: 'string', title: 'Description', format: 'textarea' },
      image: {
        type: 'object',
        title: 'Main Image',
        properties: {
          url: { type: 'string', title: 'Image URL', format: 'image' },
          alt: { type: 'string', title: 'Alt text' }
        }
      },
      images: {
        type: 'array',
        title: 'Gallery',
        items: {
          type: 'object',
          properties: {
            url: { type: 'string', title: 'Image URL', format: 'image' },
            alt: { type: 'string', title: 'Alt text' }
          }
        }
      },
      faq: {
        type: 'array',
        title: 'FAQ',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string', title: 'Question' },
            answer: { type: 'string', title: 'Answer', format: 'textarea' }
          }
        }
      },
      body: { type: 'string', title: 'Body', format: 'richtext' }
    }
  }
}
