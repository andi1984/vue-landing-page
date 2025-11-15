<script setup lang="ts">
import type { NavigationLink } from '@/types/navigation'

defineProps<{
  link: NavigationLink
}>()
</script>

<template>
  <a
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    class="block bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-indigo-400"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-600 text-gray-900">{{ link.label }}</h3>
      <div class="i-carbon-arrow-up-right text-xl text-gray-400 group-hover:text-indigo-600"></div>
    </div>
    <p class="text-sm text-gray-500 mt-2 truncate">{{ link.url }}</p>
  </a>
</template>
