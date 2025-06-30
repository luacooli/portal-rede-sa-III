export async function fetchPostsByCity(citySlug: string) {
  const res = await fetch(
    `http://localhost:1337/api/posts?filters[city][$eq]=${citySlug}&populate=*`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    throw new Error('Erro ao buscar posts da cidade no Strapi')
  }

  const json = await res.json()
  return json.data
}

export async function fetchAllPosts() {
  const res = await fetch('http://localhost:1337/api/posts?populate=*', {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Erro ao buscar posts do Strapi')
  }

  const json = await res.json()
  return json.data
}
