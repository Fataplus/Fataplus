const schema = {
    title: {
        type: 'text',
        label: 'Course Title',
        required: true,
    },
    slug: {
        type: 'text',
        label: 'Slug',
        required: true,
    },
    description: {
        type: 'textarea',
        label: 'Description',
    },
    image: {
        type: 'text',
        label: 'Cover Image URL',
    },
    overview: {
        type: 'json',
        label: 'Overview Points',
    },
    structure: {
        type: 'json',
        label: 'Course Structure/Modules',
    },
    pricing: {
        type: 'json',
        label: 'Pricing Plans',
    },
    faq: {
        type: 'json',
        label: 'FAQ',
    }
};

export default {
    name: 'courses',
    label: 'Courses',
    icon: 'bi bi-mortarboard',
    schema,
};
