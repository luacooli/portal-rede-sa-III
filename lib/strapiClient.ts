export async function fetchPosts() {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN

  const res = await fetch(`${apiUrl}/api/posts?populate=*`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error('Erro ao buscar posts do Strapi')

  const json = await res.json()
  return json.data
}
