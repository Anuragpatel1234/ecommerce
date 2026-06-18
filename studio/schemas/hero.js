export default {
  name: 'hero',
  title: 'Hero Banner',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'ctaText',
      title: 'Call to Action Text',
      type: 'string',
    },
    {
      name: 'ctaLink',
      title: 'Call to Action Link',
      type: 'string',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
    },
  ],
};
