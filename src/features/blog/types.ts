export interface BlogCategory {
  _id: string
  title: string
  slug: {
    current: string
  }
  description?: string
  color?: string
}

export interface BlogTag {
  _id: string
  title: string
  slug: {
    current: string
  }
  description?: string
}

export interface BlogGroup {
  _id: string
  _type?: "group"
  title: string
  slug: {
    current: string
  }
  description?: string
  coverImage?: {
    url: string
    alt?: string
  }
  isCompleted?: boolean
  postCount?: number
}

export interface BlogAuthor {
  name: string
  role?: string
  avatar: string
  verified?: boolean
}

export interface BlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt: string
  coverImage: {
    url: string
    alt?: string
  }
  categories: BlogCategory[]
  tags?: BlogTag[]
  group?: BlogGroup
  groupOrder?: number
  publishedAt: string
  readTime: number
  isFeatured?: boolean
  author: BlogAuthor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[]
}
