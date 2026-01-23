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
    hero_title: {
        type: 'text',
        label: 'Hero Title',
    },
    hero_description: {
        type: 'textarea',
        label: 'Hero Description',
    },
    hero_button_text: {
        type: 'text',
        label: 'Hero Button Text',
    },
    hero_button_url: {
        type: 'text',
        label: 'Hero Button URL',
    },
    body: {
        type: 'richtext',
        label: 'Main Content',
    },
    seo_title: {
        type: 'text',
        label: 'SEO Title',
    },
    seo_description: {
        type: 'textarea',
        label: 'SEO Description',
    },
    sections: {
        type: 'json',
        label: 'Page Sections',
    },
    process_steps: {
        type: 'json',
        label: 'Process Steps (Home)',
    }
};

export default {
    name: 'pages',
    label: 'Static Pages',
    icon: 'bi bi-file-earmark-text',
    schema,
};
