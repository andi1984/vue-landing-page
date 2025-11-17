<script setup lang="ts">
import { computed } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { useRouter, useRoute } from 'vue-router'

const navigationStore = useNavigationStore()
const router = useRouter()
const route = useRoute()

const sections = computed(() => navigationStore.sections)
const currentSection = computed(() => navigationStore.currentSection)
const isBlackWeekActive = computed(() => route.name === 'black-week')

const handleSectionChange = (section: string) => {
  navigationStore.setCurrentSection(section)
  router.push({ name: 'section', params: { section } })
}

const handleBlackWeekClick = () => {
  router.push({ name: 'black-week' })
}
</script>

<template>
  <div class="bg-white shadow-sm border-b border-gray-200">
    <div class="container mx-auto px-6">
      <nav class="flex gap-1 overflow-x-auto">
        <button
          v-for="section in sections"
          :key="section"
          @click="handleSectionChange(section)"
          :class="[
            'px-6 py-4 text-sm font-500 whitespace-nowrap transition-all duration-200 border-b-2',
            currentSection === section && !isBlackWeekActive
              ? 'text-indigo-600 border-indigo-600'
              : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
          ]"
        >
          {{ section.charAt(0).toUpperCase() + section.slice(1) }}
        </button>

        <!-- Black Week Tab -->
        <button
          @click="handleBlackWeekClick"
          :class="[
            'px-6 py-4 text-sm font-500 whitespace-nowrap transition-all duration-200 border-b-2',
            isBlackWeekActive
              ? 'text-indigo-600 border-indigo-600'
              : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
          ]"
        >
          🛍️ Black Week
        </button>
      </nav>
    </div>
  </div>
</template>
