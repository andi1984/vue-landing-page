export interface Tag {
  id: string
  name: string
  createdAt: Date
}

export interface Deal {
  id: string
  title: string
  description?: string
  price?: string
  originalPrice?: string
  discount?: string
  url: string
  tags: string[]
  foundAt: Date
  imageUrl?: string
}

export interface BlackWeekState {
  tags: Tag[]
  deals: Deal[]
  isLoading: boolean
  error: string | null
}
