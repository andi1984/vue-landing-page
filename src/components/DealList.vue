<script setup lang="ts">
import { computed } from 'vue'
import { useBlackWeekStore } from '@/stores/blackweek'
import type { TemperatureConfig } from '@/types/blackweek'

const store = useBlackWeekStore()

function getTemperatureConfig(temperature: number | null): TemperatureConfig {
  const temp = temperature ?? 0

  if (temp >= 150) {
    return {
      level: 'fire',
      icon: '🔥',
      color: '#dc2626',
      bgColor: '#fee2e2',
      borderColor: '#dc2626'
    }
  } else if (temp >= 100) {
    return {
      level: 'hot',
      icon: '🌶️',
      color: '#ea580c',
      bgColor: '#ffedd5',
      borderColor: '#ea580c'
    }
  } else if (temp >= 50) {
    return {
      level: 'warm',
      icon: '☀️',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      borderColor: '#f59e0b'
    }
  } else {
    return {
      level: 'cold',
      icon: '❄️',
      color: '#3b82f6',
      bgColor: '#dbeafe',
      borderColor: '#3b82f6'
    }
  }
}

function formatPrice(price: number | null): string {
  if (price === null || price === undefined) {
    return 'N/A'
  }
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const hasDeals = computed(() => store.dealCount > 0)
</script>

<template>
  <div class="deal-list">
    <!-- Loading State -->
    <div v-if="store.isLoading" class="text-center py-16">
      <div class="inline-block animate-spin text-6xl mb-4">⏳</div>
      <p class="text-gray-600 dark:text-gray-400 text-lg">Lade Deals...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="store.error && !hasDeals" class="text-center py-16">
      <div class="text-6xl mb-4">⚠️</div>
      <h3 class="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">Fehler beim Laden</h3>
      <p class="text-gray-600 dark:text-gray-400">{{ store.error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasDeals" class="text-center py-16">
      <div class="text-8xl mb-4">🛒</div>
      <h3 class="text-2xl font-bold mb-2">Noch keine Deals verfügbar</h3>
      <p class="text-gray-600 dark:text-gray-400">
        Schaue später wieder vorbei für die besten Black Week Angebote!
      </p>
    </div>

    <!-- Deal Cards -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="deal in store.sortedDeals"
          :key="deal.id"
          class="deal-card group"
        >
          <!-- Temperature Badge -->
          <div
            class="temperature-badge"
            :style="{
              backgroundColor: getTemperatureConfig(deal.temperature).bgColor,
              borderColor: getTemperatureConfig(deal.temperature).borderColor,
              color: getTemperatureConfig(deal.temperature).color
            }"
          >
            <span class="text-2xl">{{ getTemperatureConfig(deal.temperature).icon }}</span>
            <span class="font-bold text-lg ml-1">{{ deal.temperature ?? 0 }}°</span>
          </div>

          <!-- Deal Image -->
          <div class="deal-image-container">
            <img
              v-if="deal.image"
              :src="deal.image"
              :alt="deal.title || 'Deal'"
              class="deal-image"
              loading="lazy"
              @error="(e) => (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23f3f4f6%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2248%22 fill=%22%239ca3af%22%3E🎁%3C/text%3E%3C/svg%3E'"
            />
            <div v-else class="deal-image-placeholder">
              <span class="text-6xl">🎁</span>
            </div>
          </div>

          <!-- Deal Content -->
          <div class="deal-content">
            <h3 class="deal-title">
              {{ deal.title || 'Unbenannter Deal' }}
            </h3>

            <!-- Price -->
            <div class="deal-price">
              <span class="price-current">{{ formatPrice(deal.price) }}</span>
            </div>

            <!-- Date -->
            <div class="deal-date">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                Gefunden: {{ formatDate(deal.created_at) }}
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="deal-actions">
              <a
                v-if="deal.referralLink"
                :href="deal.referralLink"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary"
              >
                Zum Deal 🛍️
              </a>
              <a
                v-if="deal.detailPageUrl"
                :href="deal.detailPageUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-secondary"
                title="Details anzeigen"
              >
                Details
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Deal Count Footer -->
      <div class="text-center mt-8 text-gray-500 dark:text-gray-400">
        <p class="text-sm">
          {{ store.dealCount }} {{ store.dealCount === 1 ? 'Deal' : 'Deals' }} gefunden
          <span v-if="store.lastFetched" class="ml-2">
            • Zuletzt aktualisiert: {{ formatDate(store.lastFetched.toISOString()) }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.deal-list {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.deal-card {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.deal-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.temperature-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 12px;
  border: 2px solid;
  backdrop-filter: blur(8px);
  font-weight: 700;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.deal-card:hover .temperature-badge {
  transform: scale(1.1);
}

.deal-image-container {
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.deal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.deal-card:hover .deal-image {
  transform: scale(1.05);
}

.deal-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.deal-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deal-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  color: #1f2937;
  min-height: 50px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.deal-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-current {
  font-size: 1.875rem;
  font-weight: 800;
  color: #10b981;
  line-height: 1;
}

.deal-date {
  padding-top: 4px;
  border-top: 1px solid #e5e7eb;
}

.deal-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.btn-primary {
  flex: 1;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.938rem;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(102, 126, 234, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  padding: 12px 16px;
  background: white;
  color: #6366f1;
  border: 2px solid #6366f1;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.938rem;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #6366f1;
  color: white;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .deal-card {
    background: #1f2937;
  }

  .deal-title {
    color: #f9fafb;
  }

  .btn-secondary {
    background: #1f2937;
    color: #818cf8;
  }

  .btn-secondary:hover {
    background: #6366f1;
    color: white;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .deal-card {
    border-radius: 12px;
  }

  .deal-image-container {
    height: 200px;
  }

  .deal-content {
    padding: 16px;
  }

  .temperature-badge {
    top: 8px;
    right: 8px;
    padding: 6px 10px;
  }
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
