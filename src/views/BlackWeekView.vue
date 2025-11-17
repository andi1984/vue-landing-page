<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlackWeekStore } from '@/stores/blackweek'
import DealList from '@/components/DealList.vue'

const store = useBlackWeekStore()

onMounted(async () => {
  // Initialize from cache first
  store.initialize()
  // Then fetch fresh data
  await store.fetchDeals()
})

async function handleRefresh() {
  await store.fetchDeals(true)
}
</script>

<template>
  <div class="black-week-view">
    <!-- Header -->
    <div class="header mb-8">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Black Week Deals 2024
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-lg">
            Die besten Angebote - immer aktuell
          </p>
        </div>

        <!-- Refresh Button -->
        <button
          @click="handleRefresh"
          :disabled="store.isLoading"
          class="refresh-button"
          :class="{ 'loading': store.isLoading }"
        >
          <span class="refresh-icon" :class="{ 'spinning': store.isLoading }">🔄</span>
          <span class="ml-2">{{ store.isLoading ? 'Lädt...' : 'Aktualisieren' }}</span>
        </button>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-icon">🎯</span>
          <div>
            <div class="stat-value">{{ store.dealCount }}</div>
            <div class="stat-label">{{ store.dealCount === 1 ? 'Deal' : 'Deals' }}</div>
          </div>
        </div>

        <div v-if="store.lastFetched" class="stat-item">
          <span class="stat-icon">⏰</span>
          <div>
            <div class="stat-value text-sm">
              {{ new Date(store.lastFetched).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) }}
            </div>
            <div class="stat-label">Zuletzt aktualisiert</div>
          </div>
        </div>

        <div class="stat-item">
          <span class="stat-icon">🔥</span>
          <div>
            <div class="stat-value text-sm">
              {{ store.sortedDeals[0]?.temperature ?? 0 }}°
            </div>
            <div class="stat-label">Heißester Deal</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Deal List -->
    <DealList />

    <!-- Info Banner -->
    <div class="info-banner">
      <div class="flex items-start gap-3">
        <span class="text-2xl">ℹ️</span>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Über diese Deals
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Alle Deals werden automatisch aus unserer Datenbank geladen und nach Temperatur sortiert.
            Je höher die Temperatur, desto beliebter ist der Deal! Die Daten werden lokal zwischengespeichert
            und alle 30 Minuten automatisch aktualisiert.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.black-week-view {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
}

.header {
  text-align: left;
}

.refresh-button {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3);
}

.refresh-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(102, 126, 234, 0.4);
}

.refresh-button:active:not(:disabled) {
  transform: translateY(0);
}

.refresh-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.refresh-icon {
  display: inline-block;
  font-size: 1.25rem;
  transition: transform 0.3s;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.stats-bar {
  display: flex;
  gap: 24px;
  margin-top: 24px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #667eea;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

.info-banner {
  margin-top: 48px;
  padding: 20px;
  background: linear-gradient(135deg, #e0e7ff 0%, #e0f2fe 100%);
  border-radius: 16px;
  border: 2px solid #818cf8;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .stats-bar {
    background: #1f2937;
  }

  .info-banner {
    background: linear-gradient(135deg, #1e293b 0%, #1e3a5f 100%);
    border-color: #3b82f6;
  }

  .stat-label {
    color: #9ca3af;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .black-week-view {
    padding: 1rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .stats-bar {
    flex-direction: column;
    gap: 16px;
  }

  .refresh-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
