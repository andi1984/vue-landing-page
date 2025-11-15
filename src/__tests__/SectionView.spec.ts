import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import SectionView from '@/views/SectionView.vue'
import { useNavigationStore } from '@/stores/navigation'
import type { NavigationData } from '@/types/navigation'

const mockNavigationData: NavigationData = {
  development: {
    links: [
      { label: 'GitHub', url: 'https://github.com' },
      { label: 'GitLab', url: 'https://gitlab.com' }
    ]
  },
  design: {
    links: [
      { label: 'Figma', url: 'https://figma.com' },
      { label: 'Dribbble', url: 'https://dribbble.com' }
    ]
  }
}

describe('SectionView', () => {
  let pinia: ReturnType<typeof createPinia>
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/section/:section',
          name: 'section',
          component: SectionView
        }
      ]
    })
  })

  it('renders loading state when store is loading', async () => {
    const navigationStore = useNavigationStore()
    navigationStore.isLoading = true

    const wrapper = mount(SectionView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          LinkCard: true
        }
      }
    })

    expect(wrapper.text()).toContain('Loading navigation...')
  })

  it('renders error state when store has an error', async () => {
    const navigationStore = useNavigationStore()
    navigationStore.isLoading = false
    navigationStore.error = 'Failed to load data'

    const wrapper = mount(SectionView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          LinkCard: true
        }
      }
    })

    expect(wrapper.text()).toContain('Error loading navigation')
    expect(wrapper.text()).toContain('Failed to load data')
  })

  it('renders empty state when no links are available', async () => {
    const navigationStore = useNavigationStore()
    navigationStore.isLoading = false
    navigationStore.error = null
    navigationStore.navigationData = mockNavigationData
    navigationStore.currentSection = 'development'

    // Mock currentLinks to return empty array
    vi.spyOn(navigationStore, 'currentLinks', 'get').mockReturnValue([])

    const wrapper = mount(SectionView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          LinkCard: true
        }
      }
    })

    expect(wrapper.text()).toContain('No links available in this section')
  })

  it('renders section title and links when data is available', async () => {
    const navigationStore = useNavigationStore()
    navigationStore.isLoading = false
    navigationStore.error = null
    navigationStore.navigationData = mockNavigationData
    navigationStore.currentSection = 'development'

    const wrapper = mount(SectionView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          LinkCard: true
        }
      }
    })

    expect(wrapper.text()).toContain('development')
    expect(wrapper.find('h1').text()).toBe('development')

    const linkCards = wrapper.findAllComponents({ name: 'LinkCard' })
    expect(linkCards).toHaveLength(2)
  })

  it('updates store when route section parameter changes', async () => {
    const navigationStore = useNavigationStore()
    navigationStore.navigationData = mockNavigationData
    const setCurrentSectionSpy = vi.spyOn(navigationStore, 'setCurrentSection')

    await router.push('/section/design')
    await router.isReady()

    const wrapper = mount(SectionView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          LinkCard: true
        }
      }
    })

    await wrapper.vm.$nextTick()

    expect(setCurrentSectionSpy).toHaveBeenCalledWith('design')
  })

  it('calls setCurrentSection immediately on mount', async () => {
    const navigationStore = useNavigationStore()
    navigationStore.navigationData = mockNavigationData
    const setCurrentSectionSpy = vi.spyOn(navigationStore, 'setCurrentSection')

    await router.push('/section/development')
    await router.isReady()

    mount(SectionView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          LinkCard: true
        }
      }
    })

    expect(setCurrentSectionSpy).toHaveBeenCalledWith('development')
  })

  it('passes correct props to LinkCard components', async () => {
    const navigationStore = useNavigationStore()
    navigationStore.isLoading = false
    navigationStore.error = null
    navigationStore.navigationData = mockNavigationData
    navigationStore.currentSection = 'development'

    const wrapper = mount(SectionView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          LinkCard: true
        }
      }
    })

    const linkCards = wrapper.findAllComponents({ name: 'LinkCard' })

    expect(linkCards[0]?.props('link')).toEqual({
      label: 'GitHub',
      url: 'https://github.com'
    })

    expect(linkCards[1]?.props('link')).toEqual({
      label: 'GitLab',
      url: 'https://gitlab.com'
    })
  })

})
