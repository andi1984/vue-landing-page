<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'
import NavigationTabs from '@/components/NavigationTabs.vue'

const router = useRouter()
const navigationStore = useNavigationStore()

onMounted(async () => {
  const navigationUrl = import.meta.env.VITE_NAVIGATION_URL

  if (!navigationUrl) {
    console.error('VITE_NAVIGATION_URL is not defined in environment variables')
    return
  }

  await navigationStore.loadNavigation(navigationUrl)

  // Redirect to first section if we're on the root path
  if (navigationStore.sections.length > 0) {
    const currentPath = router.currentRoute.value.path
    if (currentPath === '/') {
      router.replace({
        name: 'section',
        params: { section: navigationStore.sections[0] }
      })
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-6 py-6">
        <h1 class="text-3xl font-800 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Quick Navigation
        </h1>
        <p class="text-gray-600 mt-1">Your personal dashboard to the web</p>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <NavigationTabs />

    <!-- Main Content -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Any custom styles if needed - UnoCSS handles most styling */
</style>
