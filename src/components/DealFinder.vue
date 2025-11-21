<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBlackWeekStore } from '@/stores/blackweek'

const store = useBlackWeekStore()

// Filter state
const searchQuery = ref('')
const minTemperature = ref(0)
const selectedCategory = ref<'all' | 'hot' | 'warm' | 'cool'>('all')
const showFilters = ref(false)

// Helper function for temperature class
function getTempClass(temp: number): string {
  if (temp >= 100) return 'hot'
  if (temp >= 50) return 'warm'
  return 'cool'
}

// Filtered deals
const filteredDeals = computed(() => {
  let deals = [...store.sortedDeals]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    deals = deals.filter(
      deal =>
        deal.title?.toLowerCase().includes(query)
    )
  }

  // Temperature filter
  deals = deals.filter(deal => (deal.temperature ?? 0) >= minTemperature.value)

  // Category filter
  if (selectedCategory.value !== 'all') {
    deals = deals.filter(deal => {
      const temp = deal.temperature ?? 0
      if (selectedCategory.value === 'hot') return temp >= 100
      if (selectedCategory.value === 'warm')
        return temp >= 50 && temp < 100
      if (selectedCategory.value === 'cool') return temp < 50
      return true
    })
  }

  return deals
})

// Reset filters
function resetFilters() {
  searchQuery.value = ''
  minTemperature.value = 0
  selectedCategory.value = 'all'
}

// Animation for results
const showResults = ref(true)
function triggerResultAnimation() {
  showResults.value = false
  setTimeout(() => {
    showResults.value = true
  }, 50)
}

// Watch filters and trigger animation
function updateFilters() {
  triggerResultAnimation()
}
</script>

<template>
  <div class="deal-finder">
    <!-- Header -->
    <div class="finder-header">
      <h2 class="finder-title">
        <span class="icon">🔍</span>
        Deal Finder
      </h2>
      <button @click="showFilters = !showFilters" class="filter-toggle">
        <span>{{ showFilters ? 'Filter verstecken' : 'Filter anzeigen' }}</span>
        <span class="toggle-icon" :class="{ 'rotated': showFilters }">▼</span>
      </button>
    </div>

    <!-- Search Bar -->
    <div class="search-container">
      <div class="search-input-wrapper">
        <span class="search-icon">🔎</span>
        <input
          v-model="searchQuery"
          @input="updateFilters"
          type="text"
          placeholder="Suche nach Produkten, Kategorien, Marken..."
          class="search-input"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''; updateFilters()"
          class="clear-button"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Filter Panel -->
    <Transition name="slide">
      <div v-if="showFilters" class="filter-panel">
        <!-- Category Filter -->
        <div class="filter-group">
          <label class="filter-label">Kategorie</label>
          <div class="category-buttons">
            <button
              @click="selectedCategory = 'all'; updateFilters()"
              class="category-btn"
              :class="{ active: selectedCategory === 'all' }"
            >
              <span class="category-icon">🎯</span>
              Alle
            </button>
            <button
              @click="selectedCategory = 'hot'; updateFilters()"
              class="category-btn hot"
              :class="{ active: selectedCategory === 'hot' }"
            >
              <span class="category-icon">🔥</span>
              Hot
            </button>
            <button
              @click="selectedCategory = 'warm'; updateFilters()"
              class="category-btn warm"
              :class="{ active: selectedCategory === 'warm' }"
            >
              <span class="category-icon">☀️</span>
              Warm
            </button>
            <button
              @click="selectedCategory = 'cool'; updateFilters()"
              class="category-btn cool"
              :class="{ active: selectedCategory === 'cool' }"
            >
              <span class="category-icon">❄️</span>
              Cool
            </button>
          </div>
        </div>

        <!-- Temperature Slider -->
        <div class="filter-group">
          <label class="filter-label">
            Mindest-Temperatur: <span class="temp-value">{{ minTemperature }}°</span>
          </label>
          <div class="slider-container">
            <input
              v-model.number="minTemperature"
              @input="updateFilters"
              type="range"
              min="0"
              max="200"
              step="10"
              class="temperature-slider"
            />
            <div class="slider-labels">
              <span>0°</span>
              <span>100°</span>
              <span>200°</span>
            </div>
          </div>
        </div>

        <!-- Reset Button -->
        <button @click="resetFilters(); updateFilters()" class="reset-button">
          <span>🔄</span>
          Filter zurücksetzen
        </button>
      </div>
    </Transition>

    <!-- Results Counter -->
    <div class="results-info">
      <Transition name="fade" mode="out-in">
        <div :key="filteredDeals.length" class="results-counter">
          <span class="results-icon">✨</span>
          <span class="results-text">
            <strong>{{ filteredDeals.length }}</strong>
            {{ filteredDeals.length === 1 ? 'Deal gefunden' : 'Deals gefunden' }}
          </span>
        </div>
      </Transition>
    </div>

    <!-- Compact Deal List -->
    <Transition name="fade" mode="out-in">
      <div v-if="showResults" class="compact-deals">
        <TransitionGroup name="list">
          <div
            v-for="(deal, index) in filteredDeals.slice(0, 5)"
            :key="deal.id"
            class="compact-deal-card"
            :style="{ '--delay': `${index * 0.05}s` }"
          >
            <div class="deal-temp-badge" :class="getTempClass(deal.temperature ?? 0)">
              {{ deal.temperature ?? 0 }}°
            </div>
            <div class="deal-content">
              <h4 class="deal-title">{{ deal.title || 'Unbekannter Deal' }}</h4>
              <p class="deal-description">Preis: {{ deal.price ? `${deal.price}€` : 'N/A' }}</p>
            </div>
            <a
              :href="deal.referralLink || deal.detailPageUrl || '#'"
              target="_blank"
              class="deal-link-btn"
            >
              →
            </a>
          </div>
        </TransitionGroup>

        <div v-if="filteredDeals.length > 5" class="show-more">
          <p class="show-more-text">
            ... und {{ filteredDeals.length - 5 }} weitere Deals
          </p>
          <p class="show-more-hint">Scrolle nach unten für alle Deals</p>
        </div>

        <div v-if="filteredDeals.length === 0" class="no-results">
          <span class="no-results-icon">😢</span>
          <h3>Keine Deals gefunden</h3>
          <p>Versuche andere Suchbegriffe oder Filter</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.deal-finder {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.95));
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 48px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* Header */
.finder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.finder-title {
  font-size: 2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-toggle:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.toggle-icon {
  transition: transform 0.3s;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

/* Search Bar */
.search-container {
  margin-bottom: 24px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  font-size: 1.5rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 16px 48px 16px 56px;
  font-size: 1.125rem;
  border: 3px solid #e5e7eb;
  border-radius: 16px;
  outline: none;
  transition: all 0.3s;
  background: white;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.clear-button {
  position: absolute;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: all 0.2s;
}

.clear-button:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Filter Panel */
.filter-panel {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 2px solid #e5e7eb;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  display: block;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1f2937;
  font-size: 1rem;
}

.temp-value {
  color: #667eea;
}

/* Category Buttons */
.category-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.category-btn {
  flex: 1;
  min-width: 100px;
  padding: 12px 20px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.category-btn.hot.active {
  border-color: #ef4444;
  background: #ef4444;
}

.category-btn.warm.active {
  border-color: #f59e0b;
  background: #f59e0b;
}

.category-btn.cool.active {
  border-color: #3b82f6;
  background: #3b82f6;
}

.category-icon {
  font-size: 1.25rem;
}

/* Temperature Slider */
.slider-container {
  position: relative;
}

.temperature-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #3b82f6, #f59e0b, #ef4444);
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.temperature-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 3px solid #667eea;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.temperature-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  border-color: #764ba2;
}

.temperature-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 3px solid #667eea;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

/* Reset Button */
.reset-button {
  width: 100%;
  padding: 12px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

.reset-button:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

/* Results Info */
.results-info {
  margin-bottom: 24px;
}

.results-counter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.results-icon {
  font-size: 1.25rem;
}

/* Compact Deals */
.compact-deals {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.compact-deal-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s;
  animation: slideIn 0.5s ease-out var(--delay, 0s);
}

.compact-deal-card:hover {
  border-color: #667eea;
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.deal-temp-badge {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.125rem;
  color: white;
}

.deal-temp-badge.hot {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.deal-temp-badge.warm {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.deal-temp-badge.cool {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.deal-content {
  flex: 1;
  min-width: 0;
}

.deal-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.deal-description {
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.deal-link-btn {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
}

.deal-link-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Show More */
.show-more {
  text-align: center;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
}

.show-more-text {
  font-size: 1rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 4px;
}

.show-more-hint {
  font-size: 0.875rem;
  color: #6b7280;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 48px 24px;
  background: white;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
}

.no-results-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 16px;
}

.no-results h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.no-results p {
  font-size: 1rem;
  color: #6b7280;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .deal-finder {
    background: linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
  }

  .search-input,
  .filter-panel,
  .compact-deal-card,
  .show-more,
  .no-results {
    background: #1f2937;
    border-color: #374151;
  }

  .filter-label,
  .deal-title,
  .no-results h3 {
    color: #f3f4f6;
  }

  .category-btn {
    background: #1f2937;
    border-color: #374151;
    color: #f3f4f6;
  }

  .reset-button {
    background: #374151;
    border-color: #4b5563;
    color: #f3f4f6;
  }

  .reset-button:hover {
    background: #4b5563;
  }

  .filter-toggle {
    background: #1f2937;
    border-color: #374151;
    color: #f3f4f6;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .deal-finder {
    padding: 20px;
  }

  .finder-title {
    font-size: 1.5rem;
  }

  .search-input {
    font-size: 1rem;
    padding: 14px 48px 14px 48px;
  }

  .category-buttons {
    flex-direction: column;
  }

  .category-btn {
    min-width: auto;
  }

  .compact-deal-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .deal-link-btn {
    align-self: flex-end;
  }
}
</style>
