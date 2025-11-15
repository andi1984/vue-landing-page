import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { NavigationData } from '@/types/navigation'

export const useNavigationStore = defineStore('navigation', () => {
  const navigationData = ref<NavigationData | null>(null)
  const currentSection = ref<string>('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const sections = computed(() => {
    if (!navigationData.value) return []
    return Object.keys(navigationData.value)
  })

  const currentLinks = computed(() => {
    if (!navigationData.value || !currentSection.value) return []
    return navigationData.value[currentSection.value]?.links || []
  })

  async function loadNavigation(url: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch navigation data: ${response.statusText}`)
      }

      const data = await response.json() as NavigationData
      navigationData.value = data

      // Set the first section as default if not already set
      if (!currentSection.value && sections.value.length > 0) {
        const firstSection = sections.value[0]
        if (firstSection) {
          currentSection.value = firstSection
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
      console.error('Error loading navigation:', e)
    } finally {
      isLoading.value = false
    }
  }

  function setCurrentSection(section: string) {
    if (sections.value.includes(section)) {
      currentSection.value = section
    }
  }

  return {
    navigationData,
    currentSection,
    isLoading,
    error,
    sections,
    currentLinks,
    loadNavigation,
    setCurrentSection,
  }
})
