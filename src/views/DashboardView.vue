<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'
import NavigationSidebar from '@/components/NavigationSidebar.vue'
import LinkCard from '@/components/LinkCard.vue'

const router = useRouter()
const navigationStore = useNavigationStore()

const currentLinks = computed(() => navigationStore.currentLinks)
const currentSection = computed(() => navigationStore.currentSection)
const sections = computed(() => navigationStore.sections)
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

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
        name: 'dashboard',
        params: { section: navigationStore.sections[0] }
      })
    }
  }
})

const handleSectionChange = (section: string) => {
  navigationStore.setCurrentSection(section)
  router.push({ name: 'dashboard', params: { section } })
  isMobileMenuOpen.value = false
}

const navigationUrl = import.meta.env.VITE_NAVIGATION_URL

const retryLoad = () => {
  if (navigationUrl) {
    navigationStore.loadNavigation(navigationUrl)
  }
}

// Color palette for sections
const sectionColors = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-indigo-500 to-purple-500',
  'from-teal-500 to-blue-500',
  'from-pink-500 to-rose-500',
  'from-yellow-500 to-orange-500'
]

const getSectionColor = (index: number) => {
  return sectionColors[index % sectionColors.length]
}

const activeSectionIndex = computed(() => {
  return sections.value.findIndex(s => s === currentSection.value)
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Mobile Header -->
    <header class="lg:hidden bg-white shadow-sm sticky top-0 z-40">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-3">
          <button @click="toggleMobileMenu" class="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <div class="i-carbon-menu text-2xl text-slate-600"></div>
          </button>
          <div>
            <h1 class="text-xl font-800 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Dashboard
            </h1>
            <p class="text-sm text-slate-500">{{ currentSection }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="i-carbon-sun text-xl text-slate-600"></div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar Navigation -->
      <NavigationSidebar
        :sections="sections"
        :current-section="currentSection"
        :is-mobile-menu-open="isMobileMenuOpen"
        @section-change="handleSectionChange"
        @close-mobile-menu="() => isMobileMenuOpen = false"
      />

      <!-- Mobile Menu Overlay -->
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden fixed inset-0 bg-black/50 z-40"
        @click="isMobileMenuOpen = false"
      />

      <!-- Main Content -->
      <main class="flex-1 lg:ml-64 transition-all duration-300">
        <!-- Desktop Header -->
        <div class="hidden lg:block sticky top-0 z-30 bg-slate-50/80 backdrop-blur-lg border-b border-slate-200/50">
          <div class="px-8 py-4">
            <h1 class="text-2xl font-800 text-slate-800">
              {{ currentSection.charAt(0).toUpperCase() + currentSection.slice(1) }}
            </h1>
            <p class="text-sm text-slate-500 mt-1">Personal Dashboard</p>
          </div>
        </div>

        <div class="p-6 lg:p-8">
          <!-- Loading State -->
          <div v-if="navigationStore.isLoading" class="flex items-center justify-center min-h-[400px]">
            <div class="flex flex-col items-center gap-4">
              <div class="relative">
                <div class="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5 animate-spin-slow">
                  <div class="w-full h-full bg-white rounded-full"></div>
                </div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="i-carbon-circle-dash text-2xl text-purple-600"></div>
                </div>
              </div>
              <p class="text-slate-600 font-medium">Loading dashboard...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="navigationStore.error" class="flex items-center justify-center min-h-[400px]">
            <div class="text-center">
              <div class="i-carbon-warning text-5xl text-red-500 mx-auto mb-4"></div>
              <p class="text-red-500 font-600 mb-2">Error loading navigation</p>
              <p class="text-slate-500 text-sm">{{ navigationStore.error }}</p>
              <button
                @click="retryLoad"
                class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="currentLinks.length === 0" class="flex items-center justify-center min-h-[400px]">
            <div class="text-center">
              <div class="i-carbon-document-blank text-5xl text-slate-300 mx-auto mb-4"></div>
              <p class="text-slate-500 text-lg">No links available in this section</p>
              <p class="text-slate-400 text-sm mt-2">Add some links to get started</p>
            </div>
          </div>

          <!-- Content Grid -->
          <div v-else class="space-y-6">
            <!-- Section Header -->
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-700 text-slate-800">
                  {{ currentSection.charAt(0).toUpperCase() + currentSection.slice(1) }}
                </h2>
                <p class="text-slate-500 mt-1">{{ currentLinks.length }} links</p>
              </div>
              <div class="hidden md:flex items-center gap-2">
                <span class="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-500">
                  {{ currentLinks.length }} items
                </span>
              </div>
            </div>

            <!-- Links Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <LinkCard
                v-for="(link, index) in currentLinks"
                :key="`${link.label}-${index}`"
                :link="link"
                :index="index"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
