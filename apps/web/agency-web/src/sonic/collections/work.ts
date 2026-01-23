import type { CollectionConfig } from '@sonicjs-cms/core'

export const workCollection: CollectionConfig = {
  name: 'work',
  displayName: 'Work',
  description: 'Work portfolio',
  schema: {
    type: 'object',
    required: ['title', 'work'],
    properties: {
      work: {
        type: 'string',
        title: 'Work (slug or id)'
      },
      live: {
        type: 'string',
        title: 'Live URL'
      },
      title: {
        type: 'string',
        title: 'Title'
      },
      description: {
        type: 'string',
        title: 'Description',
        format: 'textarea'
      },
      intro: {
        type: 'array',
        title: 'Intro',
        items: {
          type: 'object',
          properties: {
            paragraphs: {
              type: 'array',
              title: 'Paragraphs',
              items: { type: 'string' }
            }
          }
        }
      },
      outro: {
        type: 'array',
        title: 'Outro',
        items: {
          type: 'object',
          properties: {
            paragraphs: {
              type: 'array',
              title: 'Paragraphs',
              items: { type: 'string' }
            }
          }
        }
      },
      highlights: {
        type: 'array',
        title: 'Highlights',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            paragraphs: {
              type: 'array',
              title: 'Paragraphs',
              items: { type: 'string' }
            }
          }
        }
      },
      projectData: {
        type: 'array',
        title: 'Project Data',
        items: {
          type: 'object',
          properties: {
            client: { type: 'string', title: 'Client' },
            service: { type: 'string', title: 'Service' },
            sector: { type: 'string', title: 'Sector' },
            year: { type: 'string', title: 'Year' }
          }
        }
      },
      credits: {
        type: 'array',
        title: 'Credits',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', title: 'Name' },
            role: { type: 'string', title: 'Role' }
          }
        }
      },
      images: {
        type: 'array',
        title: 'Images',
        items: {
          type: 'object',
          properties: {
            url: { type: 'string', title: 'Image URL', format: 'image' },
            alt: { type: 'string', title: 'Alt text' }
          }
        }
      },
      thumbnail: {
        type: 'object',
        title: 'Thumbnail',
        properties: {
          url: { type: 'string', title: 'Image URL', format: 'image' },
          alt: { type: 'string', title: 'Alt text' }
        }
      },
      body: {
        type: 'string',
        title: 'Body',
        format: 'richtext'
      }
    }
  }
}
