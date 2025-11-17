import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Deal } from '@/types/blackweek'
import { supabase } from '@/lib/supabase'

const CACHE_KEY = 'blackweek-deals'
const CACHE_TIMESTAMP_KEY = 'blackweek-deals-timestamp'
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

export const useBlackWeekStore = defineStore('blackweek', () => {
  // State
  const deals = ref<Deal[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastFetched = ref<Date | null>(null)

  // Computed
  const dealCount = computed(() => deals.value.length)
  const sortedDeals = computed(() => {
    return [...deals.value].sort((a, b) => {
      // Sort by temperature (descending), then by created_at (descending)
      const tempA = a.temperature ?? 0
      const tempB = b.temperature ?? 0

      if (tempB !== tempA) {
        return tempB - tempA
      }

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  })

  // Actions
  async function fetchDeals(forceRefresh = false): Promise<void> {
    // Check if we have valid cache
    if (!forceRefresh && isCacheValid()) {
      loadFromCache()
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('mydeals')
        .select('*')
        .order('temperature', { ascending: false })
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      deals.value = data || []
      lastFetched.value = new Date()

      // Save to cache
      saveToCache()
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error'
      error.value = `Failed to fetch deals: ${errorMessage}`
      console.error('Supabase fetch error:', e)

      // Try to load from cache as fallback
      loadFromCache()
    } finally {
      isLoading.value = false
    }
  }

  function saveToCache(): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(deals.value))
      localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString())
    } catch (e) {
      console.error('Failed to save to cache:', e)
    }
  }

  function loadFromCache(): void {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)

      if (cached) {
        deals.value = JSON.parse(cached)
      }

      if (timestamp) {
        lastFetched.value = new Date(timestamp)
      }
    } catch (e) {
      console.error('Failed to load from cache:', e)
    }
  }

  function isCacheValid(): boolean {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)

    if (!timestamp) {
      return false
    }

    const cacheTime = new Date(timestamp).getTime()
    const now = new Date().getTime()

    return now - cacheTime < CACHE_DURATION
  }

  function clearCache(): void {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_TIMESTAMP_KEY)
    deals.value = []
    lastFetched.value = null
  }

  // Initialize from cache
  function initialize(): void {
    loadFromCache()
  }

  return {
    // State
    deals,
    isLoading,
    error,
    lastFetched,
    // Computed
    dealCount,
    sortedDeals,
    // Actions
    fetchDeals,
    clearCache,
    initialize
  }
})
