<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlackWeekStore } from '@/stores/blackweek'
import TagManager from '@/components/TagManager.vue'
import DealList from '@/components/DealList.vue'

const store = useBlackWeekStore()
const activeTab = ref<'tags' | 'deals'>('tags')

onMounted(() => {
  // Load saved data from localStorage
  store.loadFromLocalStorage()
})

function setActiveTab(tab: 'tags' | 'deals') {
  activeTab.value = tab
}
</script>

<template>
  <div class="black-week-view">
    <!-- Header -->
    <div class="header mb-8">
      <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Black Week Deal Monitor
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Track and monitor the best Black Week deals with custom tags
      </p>
    </div>

    <!-- Tab Navigation -->
    <div class="tabs mb-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex gap-4">
        <button
          :class="[
            'tab-button px-4 py-2 font-semibold transition-colors relative',
            activeTab === 'tags'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
          @click="setActiveTab('tags')"
        >
          Tags
          <span
            v-if="store.tagCount > 0"
            class="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs rounded-full"
          >
            {{ store.tagCount }}
          </span>
          <div
            v-if="activeTab === 'tags'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
          />
        </button>

        <button
          :class="[
            'tab-button px-4 py-2 font-semibold transition-colors relative',
            activeTab === 'deals'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
          @click="setActiveTab('deals')"
        >
          Deals
          <span
            v-if="store.dealCount > 0"
            class="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs rounded-full"
          >
            {{ store.dealCount }}
          </span>
          <div
            v-if="activeTab === 'deals'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
          />
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <div v-show="activeTab === 'tags'" class="fade-in">
        <TagManager />
      </div>

      <div v-show="activeTab === 'deals'" class="fade-in">
        <DealList />
      </div>
    </div>

    <!-- Info Box -->
    <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">
        📡 API Integration Status
      </h3>
      <p class="text-sm text-blue-800 dark:text-blue-200">
        The deal monitoring API is not yet connected. Once integrated, it will automatically search for deals
        matching your tags and populate them here. For now, you can add tags and the system will store them locally.
      </p>
    </div>
  </div>
</template>

<style scoped>
.black-week-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  text-align: left;
}

.tab-button {
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .black-week-view {
    padding: 1rem;
  }
}
</style>
