<script setup lang="ts">
import { useBlackWeekStore } from '@/stores/blackweek'

const store = useBlackWeekStore()

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function handleRemoveDeal(dealId: string) {
  if (confirm('Are you sure you want to remove this deal?')) {
    store.removeDeal(dealId)
  }
}
</script>

<template>
  <div class="deal-list">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-2xl font-bold">Found Deals</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Deals matching your tags will appear here
          </p>
        </div>
        <button
          v-if="store.dealCount > 0"
          class="text-sm text-red-500 hover:text-red-700 transition-colors"
          @click="store.clearAllDeals"
        >
          Clear All Deals
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="store.dealCount === 0" class="text-center py-12 text-gray-500">
      <div class="text-6xl mb-4">🎯</div>
      <h3 class="text-xl font-semibold mb-2">No deals found yet</h3>
      <p class="text-gray-500 dark:text-gray-400">
        Add some tags and wait for the API to find matching deals.
      </p>
      <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">
        (API integration coming soon)
      </p>
    </div>

    <!-- Deal Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="deal in store.deals"
        :key="deal.id"
        class="deal-card border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
      >
        <!-- Image Placeholder -->
        <div
          v-if="deal.imageUrl"
          class="h-48 bg-cover bg-center"
          :style="{ backgroundImage: `url(${deal.imageUrl})` }"
        />
        <div v-else class="h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
          <span class="text-6xl">🎁</span>
        </div>

        <!-- Content -->
        <div class="p-4">
          <h3 class="font-bold text-lg mb-2 line-clamp-2">
            {{ deal.title }}
          </h3>

          <p v-if="deal.description" class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {{ deal.description }}
          </p>

          <!-- Price Info -->
          <div v-if="deal.price || deal.discount" class="mb-3">
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ deal.price || 'N/A' }}
              </span>
              <span v-if="deal.originalPrice" class="text-sm text-gray-500 line-through">
                {{ deal.originalPrice }}
              </span>
            </div>
            <div v-if="deal.discount" class="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded mt-1">
              {{ deal.discount }} OFF
            </div>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1 mb-3">
            <span
              v-for="tag in deal.tags"
              :key="tag"
              class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs rounded-full"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <span class="text-xs text-gray-500">
              Found {{ formatDate(deal.foundAt) }}
            </span>
            <div class="flex gap-2">
              <a
                :href="deal.url"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                View Deal
              </a>
              <button
                class="px-3 py-1 text-red-500 hover:text-red-700 text-sm transition-colors"
                @click="handleRemoveDeal(deal.id)"
                title="Remove deal"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Deal Count -->
    <div v-if="store.dealCount > 0" class="text-center mt-6 text-gray-500 text-sm">
      Showing {{ store.dealCount }} deal{{ store.dealCount !== 1 ? 's' : '' }}
    </div>
  </div>
</template>

<style scoped>
.deal-list {
  max-width: 1200px;
}

.deal-card {
  transition: transform 0.2s;
}

.deal-card:hover {
  transform: translateY(-2px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
