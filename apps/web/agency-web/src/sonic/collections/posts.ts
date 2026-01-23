import type { CollectionConfig } from '@sonicjs-cms/core'

export const postsCollection: CollectionConfig = {
  name: 'posts',
  displayName: 'Posts',
  description: 'Blog posts',
  schema: {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string', title: 'Title' },
      pubDate: { type: 'string', title: 'Publication Date', format: 'date' },
      description: { type: 'string', title: 'Description', format: 'textarea' },
      author: { type: 'string', title: 'Author' },
      image: {
        type: 'object',
        title: 'Cover Image',
        properties: {
          url: { type: 'string', title: 'Image URL', format: 'image' },
          alt: { type: 'string', title: 'Alt text' }
        }
      },
      tags: {
        type: 'array',
        title: 'Tags',
        items: { type: 'string' }
      },
      body: { type: 'string', title: 'Body', format: 'richtext' }
    }
  }
}
