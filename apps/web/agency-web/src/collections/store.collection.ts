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
    price: {
        type: 'text',
        label: 'Price',
    },
    checkout: {
        type: 'text',
        label: 'Checkout URL',
    },
    license: {
        type: 'text',
        label: 'License',
    },
    description: {
        type: 'textarea',
        label: 'Description',
    },
    highlights: {
        type: 'json',
        label: 'Highlights',
    },
    specifications: {
        type: 'json',
        label: 'Specifications',
    },
    image: {
        type: 'json',
        label: 'Main Image',
    },
    images: {
        type: 'json',
        label: 'Gallery Images',
    },
    faq: {
        type: 'json',
        label: 'FAQ',
    }
};

export default {
    name: 'store',
    label: 'Product Store',
    icon: 'bi bi-shop',
    schema,
};
