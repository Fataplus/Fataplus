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
    work: {
        type: 'text',
        label: 'Category/Type',
    },
    live: {
        type: 'text',
        label: 'Live URL',
    },
    date: {
        type: 'text',
        label: 'Date',
    },
    description: {
        type: 'textarea',
        label: 'Description',
    },
    intro: {
        type: 'json',
        label: 'Intro',
    },
    outro: {
        type: 'json',
        label: 'Outro',
    },
    highlights: {
        type: 'json',
        label: 'Highlights',
    },
    projectData: {
        type: 'json',
        label: 'Project Data',
    },
    credits: {
        type: 'json',
        label: 'Credits',
    },
    thumbnail: {
        type: 'json',
        label: 'Thumbnail',
    },
    images: {
        type: 'json',
        label: 'Gallery Images',
    },
    body: {
        type: 'richtext',
        label: 'Case Study Content',
    }
};

export default {
    name: 'work',
    label: 'Work / Projects',
    icon: 'bi bi-briefcase',
    schema,
};
