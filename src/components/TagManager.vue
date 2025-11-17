<script setup lang="ts">
import { ref } from 'vue'
import { useBlackWeekStore } from '@/stores/blackweek'

const store = useBlackWeekStore()
const newTagName = ref('')
const inputError = ref('')

function handleAddTag() {
  inputError.value = ''

  if (!newTagName.value.trim()) {
    inputError.value = 'Please enter a tag name'
    return
  }

  const success = store.addTag(newTagName.value)

  if (success) {
    newTagName.value = ''
  } else {
    inputError.value = store.error || 'Failed to add tag'
  }
}

function handleRemoveTag(tagId: string) {
  store.removeTag(tagId)
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleAddTag()
  }
}
</script>

<template>
  <div class="tag-manager">
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Tag Management</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Add tags to search for deals during Black Week. The API will monitor these tags and find matching deals.
      </p>

      <!-- Add Tag Input -->
      <div class="flex gap-2 mb-2">
        <input
          v-model="newTagName"
          type="text"
          placeholder="Enter tag name (e.g., laptop, headphones)"
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          @keypress="handleKeyPress"
        />
        <button
          class="btn px-6 py-2"
          @click="handleAddTag"
        >
          Add Tag
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="inputError" class="text-red-500 text-sm">
        {{ inputError }}
      </div>
    </div>

    <!-- Tags Display -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold">
          Active Tags ({{ store.tagCount }})
        </h3>
        <button
          v-if="store.tagCount > 0"
          class="text-sm text-red-500 hover:text-red-700 transition-colors"
          @click="store.clearAllTags"
        >
          Clear All
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="store.tagCount === 0" class="text-center py-8 text-gray-500">
        <div class="text-4xl mb-2">🏷️</div>
        <p>No tags yet. Add your first tag to start monitoring deals!</p>
      </div>

      <!-- Tag List -->
      <div v-else class="flex flex-wrap gap-2">
        <div
          v-for="tag in store.tags"
          :key="tag.id"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full"
        >
          <span class="font-medium">{{ tag.name }}</span>
          <button
            class="hover:text-red-600 dark:hover:text-red-400 transition-colors"
            @click="handleRemoveTag(tag.id)"
            title="Remove tag"
          >
            <span class="text-lg">×</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tag-manager {
  max-width: 800px;
}

.btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.btn:active {
  transform: translateY(0);
}
</style>
