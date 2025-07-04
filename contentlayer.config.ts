import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import { cities } from './lib/constants/cities'
import slugify from 'slugify'

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    city: {
      type: 'enum',
      options: cities.map((c) => c.name),
      required: true,
      description: 'Deve ser uma das 13 cidades da rede',
    },
    topic: {
      type: 'string',
      description: 'Category of the news',
      required: true,
    },
    description: {
      type: 'string',
      description: 'small descriptions about the news',
      required: true,
    },
    image: {
      type: 'string',
      description: 'Image of the news',
      required: false,
    },
    youtubeUrl: { type: 'string', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/posts/${doc._raw.flattenedPath}`,
    },
    excerpt: {
      type: 'string',
      resolve: (doc) => doc.body.raw.slice(0, 200) + '...',
    },
    slug: {
      type: 'string',
      resolve: (post) =>
        post.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, ''),
    },
    citySlug: {
      type: 'string',
      resolve: (post) =>
        post.city
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, ''),
    },
    topicSlug: {
      type: 'string',
      resolve: (post) =>
        post.topic
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, ''),
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
})
