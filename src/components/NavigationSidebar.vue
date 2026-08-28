<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  sections: string[]
  currentSection: string
  isMobileMenuOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'section-change', section: string): void
  (e: 'close-mobile-menu'): void
}>()

const sectionIcons = [
  'i-carbon-home',
  'i-carbon-briefcase',
  'i-carbon-code',
  'i-carbon-book',
  'i-carbon-settings',
  'i-carbon-favorite',
  'i-carbon-cloud',
  'i-carbon-star'
]

const getIcon = (index: number) => {
  return sectionIcons[index % sectionIcons.length]
}

const sectionColors = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-indigo-500 to-purple-500',
  'from-teal-500 to-blue-500',
  'from-pink-500 to-rose-500',
  'i-carbon-star'
]

const getSectionColor = (index: number) => {
  return sectionColors[index % sectionColors.length]
}
</script>

<template>
  <!-- Desktop Sidebar -->
  <aside class="hidden lg:block w-64 bg-white shadow-sm border-r border-slate-200/50 h-screen sticky top-0 z-30">
    <div class="p-6">
      <!-- Logo -->
      <div class="mb-8">
        <h1 class="text-2xl font-800 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          QuickNav
        </h1>
        <p class="text-sm text-slate-500">Your Dashboard</p>
      </div>

      <!-- Navigation -->
      <nav class="space-y-2">
        <div
          v-for="(section, index) in sections"
          :key="section"
          @click="emit('section-change', section)"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200',
            currentSection === section
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <div :class="getIcon(index)" class="text-xl flex-shrink-0"></div>
          <span class="font-500">{{ section.charAt(0).toUpperCase() + section.slice(1) }}</span>
          <div
            v-if="currentSection === section"
            class="ml-auto w-2 h-2 bg-white rounded-full"
          />
        </div>
      </nav>

      <!-- Footer -->
      <div class="mt-auto pt-6 border-t border-slate-200/50">
        <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
          <div class="i-carbon-user text-xl text-slate-500"></div>
          <div>
            <p class="font-500 text-slate-700">Dashboard</p>
            <p class="text-xs text-slate-400">Personal Navigation</p>
          </div>
        </div>
      </div>
    </div>
  </aside>

  <!-- Mobile Sidebar (Slide-in) -->
  <aside
    :class="[
      'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="p-6">
      <!-- Mobile Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-800 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          QuickNav
        </h1>
        <button @click="emit('close-mobile-menu')" class="p-2 rounded-lg hover:bg-slate-100">
          <div class="i-carbon-close text-xl text-slate-500"></div>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="space-y-2">
        <div
          v-for="(section, index) in sections"
          :key="section"
          @click="() => {
            emit('section-change', section)
            emit('close-mobile-menu')
          }"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200',
            currentSection === section
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <div :class="getIcon(index)" class="text-xl flex-shrink-0"></div>
          <span class="font-500">{{ section.charAt(0).toUpperCase() + section.slice(1) }}</span>
          <div
            v-if="currentSection === section"
            class="ml-auto w-2 h-2 bg-white rounded-full"
          />
        </div>
      </nav>

      <!-- Footer -->
      <div class="mt-auto pt-6 border-t border-slate-200/50">
        <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
          <div class="i-carbon-user text-xl text-slate-500"></div>
          <div>
            <p class="font-500 text-slate-700">Dashboard</p>
            <p class="text-xs text-slate-400">Personal Navigation</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
