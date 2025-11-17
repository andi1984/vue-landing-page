import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Tag, Deal, BlackWeekState } from '@/types/blackweek'

export const useBlackWeekStore = defineStore('blackweek', () => {
  // State
  const tags = ref<Tag[]>([])
  const deals = ref<Deal[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const tagCount = computed(() => tags.value.length)
  const dealCount = computed(() => deals.value.length)
  const tagNames = computed(() => tags.value.map(tag => tag.name))

  // Actions - Tag Management
  function addTag(tagName: string): boolean {
    const trimmedName = tagName.trim()

    if (!trimmedName) {
      error.value = 'Tag name cannot be empty'
      return false
    }

    // Check for duplicates (case-insensitive)
    if (tags.value.some(tag => tag.name.toLowerCase() === trimmedName.toLowerCase())) {
      error.value = 'Tag already exists'
      return false
    }

    const newTag: Tag = {
      id: crypto.randomUUID(),
      name: trimmedName,
      createdAt: new Date()
    }

    tags.value.push(newTag)
    error.value = null
    saveTags()
    return true
  }

  function removeTag(tagId: string): void {
    tags.value = tags.value.filter(tag => tag.id !== tagId)
    saveTags()
  }

  function clearAllTags(): void {
    tags.value = []
    saveTags()
  }

  // Actions - Deal Management
  function addDeal(deal: Omit<Deal, 'id' | 'foundAt'>): void {
    const newDeal: Deal = {
      ...deal,
      id: crypto.randomUUID(),
      foundAt: new Date()
    }
    deals.value.unshift(newDeal) // Add to beginning for newest first
    saveDeals()
  }

  function removeDeal(dealId: string): void {
    deals.value = deals.value.filter(deal => deal.id !== dealId)
    saveDeals()
  }

  function clearAllDeals(): void {
    deals.value = []
    saveDeals()
  }

  // Persistence
  function saveTags(): void {
    try {
      localStorage.setItem('blackweek-tags', JSON.stringify(tags.value))
    } catch (e) {
      console.error('Failed to save tags:', e)
    }
  }

  function saveDeals(): void {
    try {
      localStorage.setItem('blackweek-deals', JSON.stringify(deals.value))
    } catch (e) {
      console.error('Failed to save deals:', e)
    }
  }

  function loadFromLocalStorage(): void {
    try {
      const savedTags = localStorage.getItem('blackweek-tags')
      if (savedTags) {
        const parsedTags = JSON.parse(savedTags)
        tags.value = parsedTags.map((tag: Tag) => ({
          ...tag,
          createdAt: new Date(tag.createdAt)
        }))
      }

      const savedDeals = localStorage.getItem('blackweek-deals')
      if (savedDeals) {
        const parsedDeals = JSON.parse(savedDeals)
        deals.value = parsedDeals.map((deal: Deal) => ({
          ...deal,
          foundAt: new Date(deal.foundAt)
        }))
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
      error.value = 'Failed to load saved data'
    }
  }

  // API Integration (placeholder for future use)
  async function fetchDealsFromAPI(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/deals')
      // const data = await response.json()
      // deals.value = data

      // Placeholder for now
      console.log('API integration pending')
    } catch (e) {
      error.value = 'Failed to fetch deals from API'
      console.error('API fetch error:', e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    tags,
    deals,
    isLoading,
    error,
    // Computed
    tagCount,
    dealCount,
    tagNames,
    // Actions
    addTag,
    removeTag,
    clearAllTags,
    addDeal,
    removeDeal,
    clearAllDeals,
    loadFromLocalStorage,
    fetchDealsFromAPI
  }
})
