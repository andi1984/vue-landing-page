<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'
import LinkCard from '@/components/LinkCard.vue'

const route = useRoute()
const navigationStore = useNavigationStore()

const currentLinks = computed(() => navigationStore.currentLinks)
const currentSection = computed(() => navigationStore.currentSection)

// Update store when route changes
watch(
  () => route.params.section,
  (newSection) => {
    if (newSection && typeof newSection === 'string') {
      navigationStore.setCurrentSection(newSection)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="container mx-auto px-6 py-12">
    <div v-if="navigationStore.isLoading" class="text-center py-20">
      <div class="i-carbon-circle-dash animate-spin text-4xl text-indigo-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading navigation...</p>
    </div>

    <div v-else-if="navigationStore.error" class="text-center py-20">
      <div class="i-carbon-warning text-4xl text-red-600 mx-auto mb-4"></div>
      <p class="text-red-600 font-600 mb-2">Error loading navigation</p>
      <p class="text-gray-600 text-sm">{{ navigationStore.error }}</p>
    </div>

    <div v-else-if="currentLinks.length === 0" class="text-center py-20">
      <div class="i-carbon-document-blank text-4xl text-gray-400 mx-auto mb-4"></div>
      <p class="text-gray-600">No links available in this section</p>
    </div>

    <div v-else>
      <h1 class="text-3xl font-800 text-gray-900 mb-8 capitalize">
        {{ currentSection }}
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <LinkCard
          v-for="(link, index) in currentLinks"
          :key="`${link.label}-${index}`"
          :link="link"
        />
      </div>
    </div>
  </div>
</template>
