export const EVENT_CATEGORIES = [
    { value: 'all', label: 'All Events' },
    { value: 'tech', label: 'Tech' },
    { value: 'business', label: 'Business' },
    { value: 'music', label: 'Music' },
    { value: 'food', label: 'Food' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
];

export const editableEventCategories = EVENT_CATEGORIES.filter((category) => category.value !== 'all');

export const getEventCategoryLabel = (value) => (
    EVENT_CATEGORIES.find((category) => category.value === value)?.label || 'Other'
);
