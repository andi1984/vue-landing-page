<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBlackWeekStore } from '@/stores/blackweek'

const store = useBlackWeekStore()

// Countdown logic
const now = ref(new Date())
const blackWeekEnd = new Date('2024-12-02T23:59:59')

const countdown = computed(() => {
  const diff = blackWeekEnd.getTime() - now.value.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
})

// Temperature categories
const temperatureCategories = computed(() => {
  const deals = store.sortedDeals
  return {
    hot: deals.filter(d => (d.temperature ?? 0) >= 100).length,
    warm: deals.filter(d => (d.temperature ?? 0) >= 50 && (d.temperature ?? 0) < 100).length,
    cool: deals.filter(d => (d.temperature ?? 0) < 50).length
  }
})

// Average discount calculation
const averageDiscount = computed(() => {
  const deals = store.sortedDeals
  if (deals.length === 0) return 0

  // Extract discount percentages from titles
  let totalDiscount = 0
  let count = 0

  deals.forEach(deal => {
    const discountMatch = deal.title?.match(/(\d+)%/)
    if (discountMatch && discountMatch[1]) {
      totalDiscount += parseInt(discountMatch[1], 10)
      count++
    }
  })

  return count > 0 ? Math.round(totalDiscount / count) : 0
})

// Price ranges
const priceRanges = computed(() => {
  const deals = store.sortedDeals
  return {
    under50: deals.filter(d => d.price && d.price < 50).length,
    '50to100': deals.filter(d => d.price && d.price >= 50 && d.price < 100).length,
    '100to200': deals.filter(d => d.price && d.price >= 100 && d.price < 200).length,
    over200: deals.filter(d => d.price && d.price >= 200).length
  }
})

// Animation state
const showAnimation = ref(false)

// Update countdown every second
let intervalId: number | null = null
onMounted(() => {
  intervalId = window.setInterval(() => {
    now.value = new Date()
  }, 1000)

  // Trigger animation on mount
  setTimeout(() => {
    showAnimation.value = true
  }, 100)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// Sparkle effect
const sparkles = ref<Array<{ id: number; x: number; y: number }>>([])
let sparkleId = 0

function createSparkle(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const id = sparkleId++
  sparkles.value.push({ id, x, y })

  setTimeout(() => {
    sparkles.value = sparkles.value.filter(s => s.id !== id)
  }, 1000)
}
</script>

<template>
  <div class="dashboard-container" :class="{ 'show': showAnimation }">
    <!-- Countdown Section -->
    <div class="countdown-section glass-card" @mouseenter="createSparkle">
      <div class="countdown-header">
        <h2 class="countdown-title">
          <span class="fire-icon">🔥</span>
          Black Week endet in
          <span class="fire-icon">🔥</span>
        </h2>
      </div>

      <div class="countdown-grid">
        <div class="countdown-item">
          <div class="countdown-value">{{ countdown.days }}</div>
          <div class="countdown-label">Tage</div>
        </div>
        <div class="countdown-divider">:</div>
        <div class="countdown-item">
          <div class="countdown-value">{{ countdown.hours }}</div>
          <div class="countdown-label">Stunden</div>
        </div>
        <div class="countdown-divider">:</div>
        <div class="countdown-item">
          <div class="countdown-value">{{ countdown.minutes }}</div>
          <div class="countdown-label">Minuten</div>
        </div>
        <div class="countdown-divider">:</div>
        <div class="countdown-item">
          <div class="countdown-value">{{ countdown.seconds }}</div>
          <div class="countdown-label">Sekunden</div>
        </div>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${(1 - (blackWeekEnd.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000)) * 100}%` }"></div>
      </div>

      <!-- Sparkles -->
      <div class="sparkles">
        <div
          v-for="sparkle in sparkles"
          :key="sparkle.id"
          class="sparkle"
          :style="{ left: sparkle.x + 'px', top: sparkle.y + 'px' }"
        >✨</div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <!-- Temperature Heatmap -->
      <div class="stat-card glass-card heatmap-card">
        <h3 class="stat-card-title">
          <span class="icon">🌡️</span>
          Deal Temperatur
        </h3>
        <div class="heatmap">
          <div
            class="heatmap-bar hot"
            :style="{ width: `${(temperatureCategories.hot / store.dealCount) * 100}%` }"
          >
            <span class="heatmap-label">{{ temperatureCategories.hot }} Hot</span>
          </div>
          <div
            class="heatmap-bar warm"
            :style="{ width: `${(temperatureCategories.warm / store.dealCount) * 100}%` }"
          >
            <span class="heatmap-label">{{ temperatureCategories.warm }} Warm</span>
          </div>
          <div
            class="heatmap-bar cool"
            :style="{ width: `${(temperatureCategories.cool / store.dealCount) * 100}%` }"
          >
            <span class="heatmap-label">{{ temperatureCategories.cool }} Cool</span>
          </div>
        </div>

        <div class="heatmap-legend">
          <div class="legend-item">
            <span class="legend-dot hot"></span>
            <span>Hot (≥100°)</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot warm"></span>
            <span>Warm (50-99°)</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot cool"></span>
            <span>Cool (&lt;50°)</span>
          </div>
        </div>
      </div>

      <!-- Average Discount -->
      <div class="stat-card glass-card discount-card">
        <h3 class="stat-card-title">
          <span class="icon">💰</span>
          Durchschnitt
        </h3>
        <div class="discount-display">
          <div class="discount-value">{{ averageDiscount }}%</div>
          <div class="discount-label">Rabatt</div>
        </div>
        <div class="discount-bar">
          <div class="discount-fill" :style="{ width: `${averageDiscount}%` }"></div>
        </div>
      </div>

      <!-- Price Distribution -->
      <div class="stat-card glass-card price-card">
        <h3 class="stat-card-title">
          <span class="icon">💳</span>
          Preis-Verteilung
        </h3>
        <div class="price-chart">
          <div class="price-bar-container">
            <div class="price-bar" :style="{ height: `${(priceRanges.under50 / store.dealCount) * 100}%` }">
              <span class="price-count">{{ priceRanges.under50 }}</span>
            </div>
            <div class="price-label">&lt;50€</div>
          </div>
          <div class="price-bar-container">
            <div class="price-bar" :style="{ height: `${(priceRanges['50to100'] / store.dealCount) * 100}%` }">
              <span class="price-count">{{ priceRanges['50to100'] }}</span>
            </div>
            <div class="price-label">50-100€</div>
          </div>
          <div class="price-bar-container">
            <div class="price-bar" :style="{ height: `${(priceRanges['100to200'] / store.dealCount) * 100}%` }">
              <span class="price-count">{{ priceRanges['100to200'] }}</span>
            </div>
            <div class="price-label">100-200€</div>
          </div>
          <div class="price-bar-container">
            <div class="price-bar" :style="{ height: `${(priceRanges.over200 / store.dealCount) * 100}%` }">
              <span class="price-count">{{ priceRanges.over200 }}</span>
            </div>
            <div class="price-label">&gt;200€</div>
          </div>
        </div>
      </div>

      <!-- Top Deal Card -->
      <div class="stat-card glass-card top-deal-card" v-if="store.sortedDeals[0]">
        <h3 class="stat-card-title">
          <span class="icon">👑</span>
          Heißester Deal
        </h3>
        <div class="top-deal">
          <div class="top-deal-title">{{ store.sortedDeals[0].title || 'Unbekannter Deal' }}</div>
          <div class="top-deal-temp">{{ store.sortedDeals[0].temperature ?? 0 }}°</div>
          <a
            :href="store.sortedDeals[0].referralLink || store.sortedDeals[0].detailPageUrl || '#'"
            target="_blank"
            class="top-deal-link"
          >
            Zum Deal →
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: grid;
  gap: 24px;
  margin-bottom: 48px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
}

.dashboard-container.show {
  opacity: 1;
  transform: translateY(0);
}

.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

/* Countdown Section */
.countdown-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.countdown-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 10%, transparent 40%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.5; }
}

.countdown-header {
  text-align: center;
  margin-bottom: 24px;
}

.countdown-title {
  font-size: 1.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.fire-icon {
  font-size: 2rem;
  animation: flicker 2s infinite;
}

@keyframes flicker {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.countdown-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.countdown-item {
  text-align: center;
  min-width: 80px;
}

.countdown-value {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.countdown-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 8px;
  opacity: 0.9;
}

.countdown-divider {
  font-size: 2.5rem;
  font-weight: 700;
  opacity: 0.7;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 49% { opacity: 0.7; }
  50%, 100% { opacity: 0.2; }
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #f59e0b, #ef4444);
  border-radius: 4px;
  transition: width 1s linear;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}

.sparkles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.sparkle {
  position: absolute;
  font-size: 1.5rem;
  animation: sparkle-fade 1s ease-out forwards;
}

@keyframes sparkle-fade {
  0% {
    opacity: 1;
    transform: scale(0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: scale(1.5) rotate(180deg);
  }
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.stat-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1f2937;
}

.icon {
  font-size: 1.5rem;
}

/* Heatmap Card */
.heatmap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.heatmap-bar {
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: white;
  font-weight: 600;
  transition: width 1s ease-out;
  min-width: 80px;
}

.heatmap-bar.hot {
  background: linear-gradient(90deg, #ef4444, #dc2626);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.heatmap-bar.warm {
  background: linear-gradient(90deg, #f59e0b, #d97706);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.heatmap-bar.cool {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.heatmap-label {
  font-size: 0.875rem;
  white-space: nowrap;
}

.heatmap-legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #6b7280;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.hot { background: #ef4444; }
.legend-dot.warm { background: #f59e0b; }
.legend-dot.cool { background: #3b82f6; }

/* Discount Card */
.discount-display {
  text-align: center;
  margin-bottom: 20px;
}

.discount-value {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.discount-label {
  font-size: 1rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 8px;
}

.discount-bar {
  height: 24px;
  background: linear-gradient(90deg, #e5e7eb, #d1d5db);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.discount-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 12px;
  transition: width 1s ease-out;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
}

/* Price Card */
.price-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  gap: 12px;
}

.price-bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.price-bar {
  width: 100%;
  background: linear-gradient(180deg, #8b5cf6, #7c3aed);
  border-radius: 8px 8px 0 0;
  min-height: 20px;
  transition: height 1s ease-out;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8px;
  box-shadow: 0 -4px 12px rgba(139, 92, 246, 0.3);
}

.price-count {
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
}

.price-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  text-align: center;
}

/* Top Deal Card */
.top-deal {
  text-align: center;
}

.top-deal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.top-deal-temp {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}

.top-deal-link {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.top-deal-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .glass-card {
    background: rgba(31, 41, 55, 0.9);
  }

  .stat-card-title {
    color: #f3f4f6;
  }

  .top-deal-title {
    color: #f3f4f6;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .countdown-value {
    font-size: 2rem;
  }

  .countdown-label {
    font-size: 0.75rem;
  }

  .countdown-divider {
    font-size: 1.5rem;
  }

  .countdown-title {
    font-size: 1.25rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .discount-value {
    font-size: 3rem;
  }

  .price-chart {
    height: 150px;
  }
}
</style>
