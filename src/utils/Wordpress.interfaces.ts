export interface IWP_JWTAuthenticationResponse {
  token: string
  user_email: string
  user_nicename: string
  user_display_name: string
}

export interface IWPTag extends Record<string, any> {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: 'post_tag'
}

export interface IWPPost extends Record<string, any> {
  date: string
  date_gmt: string
  guid: {
    rendered: string
  },
  id: number
  modified: string
  modified_gmt: string
  slug: string
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private'
  type: 'post'
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  categories: number[]
  tags: number[]
  format: 'standard' | 'aside' | 'chat' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video' | 'audio'
}