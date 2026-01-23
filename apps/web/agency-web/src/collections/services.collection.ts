const schema = {
    title: {
        type: 'text',
        label: 'Service Title',
        required: true,
    },
    buttonVariant: {
        type: 'text',
        label: 'Button Variant (accent, default, muted)',
    },
    items: {
        type: 'json',
        label: 'Service Items (Name, Desc, Includes)',
    },
    icon: {
        type: 'text',
        label: 'Icon (SVG/Class)',
    }
};

export default {
    name: 'services',
    label: 'Studio Services',
    icon: 'bi bi-grid-1x2',
    schema,
};
