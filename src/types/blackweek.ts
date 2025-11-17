// Database schema matching Supabase mydeals table
export interface Deal {
  id: number
  created_at: string
  title: string | null
  temperature: number | null
  referralLink: string | null
  price: number | null
  detailPageUrl: string | null
  image: string | null
}

export interface BlackWeekState {
  deals: Deal[]
  isLoading: boolean
  error: string | null
  lastFetched: Date | null
}

// Temperature level helpers
export type TemperatureLevel = 'cold' | 'warm' | 'hot' | 'fire'

export interface TemperatureConfig {
  level: TemperatureLevel
  icon: string
  color: string
  bgColor: string
  borderColor: string
}
