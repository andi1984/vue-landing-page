<script setup lang="ts">
import type { NavigationLink } from '@/types/navigation'

interface Props {
  link: NavigationLink
  index?: number
}

const props = defineProps<Props>()

const cardColors = [
  'from-purple-400 to-pink-400',
  'from-blue-400 to-cyan-400',
  'from-green-400 to-emerald-400',
  'from-orange-400 to-red-400',
  'from-indigo-400 to-purple-400',
  'from-teal-400 to-blue-400',
  'from-pink-400 to-rose-400',
  'from-yellow-400 to-orange-400'
]

const cardIcons = [
  'i-carbon-link',
  'i-carbon-globe',
  'i-carbon-arrow-up-right',
  'i-carbon-launch',
  'i-carbon-external-link',
  'i-carbon-rocket',
  'i-carbon-star',
  'i-carbon-favorite'
]

const getColor = (index: number | undefined) => {
  if (props.link.color) return props.link.color
  if (index !== undefined) return cardColors[index % cardColors.length]
  return cardColors[0]
}

const getIcon = (index: number | undefined) => {
  if (props.link.icon) return props.link.icon
  if (index !== undefined) return cardIcons[index % cardIcons.length]
  return cardIcons[0]
}

const getInitials = (label: string) => {
  return label.charAt(0).toUpperCase()
}

const getDomain = (url: string) => {
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch {
    return url
  }
}
</script>

<template>
  <a
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    class="group block bg-white rounded-2xl p-5 shadow-sm border border-slate-200/50 hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 ease-out"
  >
    <div class="flex items-start gap-4">
      <!-- Icon/Thumbnail -->
      <div class="flex-shrink-0">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br text-white text-xl shadow-lg"
          :class="[getColor(index)]"
        >
          <template v-if="link.icon">
            <div :class="link.icon"></div>
          </template>
          <template v-else-if="getIcon(index)">
            <div :class="getIcon(index)"></div>
          </template>
          <template v-else>
            <span class="font-800 text-lg">{{ getInitials(link.label) }}</span>
          </template>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1">
          <h3 class="text-lg font-700 text-slate-800 group-hover:text-indigo-600 transition-colors">
            {{ link.label }}
          </h3>
          <div class="i-carbon-arrow-up-right text-lg text-slate-400 group-hover:text-indigo-500 transition-colors flex-shrink-0"></div>
        </div>
        
        <p v-if="link.description" class="text-sm text-slate-500 line-clamp-2 mb-2">
          {{ link.description }}
        </p>

        <!-- URL -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
            {{ getDomain(link.url) }}
          </span>
        </div>
      </div>
    </div>
  </a>
</template>
