
import { objectToQueryString } from '@/utils'


type paramsType = Record<string, string | number>

const getBlog = async (params: paramsType) => {
  const queryString = objectToQueryString(params)
  const res = await fetch(`https://www.loginextsolutions.com/blog/wp-json/wp/v2/posts?_embed&${queryString}`, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  const apipResponse = {
    total: res.headers.get('x-wp-total'),
    totalPages: res.headers.get('x-wp-totalpages'),
    data: await res.json()
  }

  return apipResponse
}

const getBlogBySlug = async (slug: string) => {
  const res = await fetch(`https://www.loginextsolutions.com/blog/wp-json/wp/v2/posts?_embed&slug=${slug}`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return {
    data: await res.json()
  }
}

const getPreviousBlog = async (date: string) => {
  const res = await fetch(`https://www.loginextsolutions.com/blog/wp-json/wp/v2/posts?before=${date}&_fields=slug&per_page=1`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return {
    data: await res.json()
  }
}

const getNextBlog = async (date: string) => {
  const res = await fetch(`https://www.loginextsolutions.com/blog/wp-json/wp/v2/posts?after=${date}&_fields=slug&per_page=1`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return {
    data: await res.json()
  }
}

const getBogTags = async (postId: number) => {
  const res = await fetch(`https://www.loginextsolutions.com/blog/wp-json/wp/v2/tags?post=${postId}&per_page=50`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return {
    data: await res.json()
  }
}

const getTagBySlug = async (slug: string) => {
  const res = await fetch(`https://www.loginextsolutions.com/blog/wp-json/wp/v2/tags?slug=${slug}&_fields=id`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return {
    data: await res.json()
  }
}

const getAllCategories = async () => {
  const res = await fetch('https://www.loginextsolutions.com/blog/wp-json/wp/v2/categories?per_page=50')

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return {
    data: await res.json()
  }
}

const getCategoryBySlug = async (slug: string) => {
  const res = await fetch(`https://www.loginextsolutions.com/blog/wp-json/wp/v2/categories?slug=${slug}`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return {
    data: await res.json()
  }
}

const getRelatedBlogs = async (tags: string) => {
  const res = await fetch(`https://www.loginextsolutions.com/blog/wp-json/wp/v2/posts?_embed&tags=${tags}`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return {
    data: await res.json()
  }
}

export {
  getBlog,
  getBlogBySlug,
  getPreviousBlog,
  getNextBlog,
  getBogTags,
  getTagBySlug,
  getAllCategories,
  getCategoryBySlug,
  getRelatedBlogs,
}
