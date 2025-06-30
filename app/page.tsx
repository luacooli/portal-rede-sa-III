import { fetchAllPosts } from '@/lib/strapiApi'
import CityNavbar from '@/components/CityNavbar'
import PostCard from '@/components/PostCard'

export default async function HomePage() {
  const posts = await fetchAllPosts()

  // Ordena do mais recente para o mais antigo
  const sortedPosts = posts.sort(
    (a: any, b: any) =>
      new Date(b.attributes.publishedAt).getTime() - new Date(a.attributes.publishedAt).getTime()
  )

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <CityNavbar />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post: any) => (
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
              topicSlug: post.attributes.topic,
              topic: post.attributes.topic
            }}
            showImg={false} // Na Home sem imagens nos cards
          />
        ))}
      </div>
    </main>
  )
}
