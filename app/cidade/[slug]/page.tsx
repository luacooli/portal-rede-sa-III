'use server'

import { fetchPostsByCity } from '@/lib/strapiApi'
import PostCard from '@/components/PostCard'

export default async function CityPage({
  params
}: {
  params: { slug: string }
}) {
  const posts = await fetchPostsByCity(params.slug)

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 capitalize">
        Notícias de {params.slug.replace(/-/g, ' ')}
      </h2>

      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <PostCard
              key={post.id}
              post={{
                _id: post.id,
                slug: post.attributes.slug,
                title: post.attributes.title,
                date: post.attributes.publishedAt,
                summary: post.attributes.summary,
                image: post.attributes.image?.data?.attributes?.url || '',
                citySlug: post.attributes.city,
                topicSlug: post.attributes.topic
              }}
            />
          ))
        ) : (
          <p className="text-gray-500">Nenhum artigo encontrado.</p>
        )}
      </div>
    </main>
  )
}
