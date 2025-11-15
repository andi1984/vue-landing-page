import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'

describe('App', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('mounts renders properly', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'home',
          component: { template: '<div>Home</div>' }
        }
      ]
    })

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          NavigationTabs: true,
          RouterView: true
        }
      }
    })

    expect(wrapper.text()).toContain('Quick Navigation')
  })
})
