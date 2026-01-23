const schema = {
    title: {
        type: 'text',
        label: 'Title',
        required: true,
    },
    slug: {
        type: 'text',
        label: 'Slug',
        required: true,
    },
    pubDate: {
        type: 'text', // Using text for simpler date handling or 'datetime'
        label: 'Publish Date',
        required: true,
    },
    description: {
        type: 'textarea',
        label: 'Description',
        required: true,
    },
    author: {
        type: 'text',
        label: 'Author',
        required: true,
    },
    image: {
        type: 'text', // Storing URL string to match legacy behavior or use 'media'
        label: 'Cover Image URL',
    },
    tags: {
        type: 'json',
        label: 'Tags',
    },
    body: {
        type: 'richtext',
        label: 'Content',
    }
};

export default {
    name: 'posts',
    label: 'Blog Posts',
    icon: 'bi bi-journal-text',
    schema,
};
