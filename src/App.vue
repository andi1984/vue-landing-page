<script setup lang="ts">
import { ref } from 'vue'

const features = [
  {
    icon: 'i-carbon-rocket',
    title: 'Lightning Fast',
    description: 'Built with performance in mind. UnoCSS generates only the CSS you use.',
  },
  {
    icon: 'i-carbon-code',
    title: 'Developer Friendly',
    description: 'Intuitive utility-first approach with full TypeScript support.',
  },
  {
    icon: 'i-carbon-settings-adjust',
    title: 'Fully Customizable',
    description: 'Configure every aspect to match your design system perfectly.',
  },
  {
    icon: 'i-carbon-cloud-upload',
    title: 'Modern Stack',
    description: 'Vue 3, Vite, Pinia, and UnoCSS - the perfect combination.',
  },
]

const email = ref('')

const handleSubmit = () => {
  console.log('Email submitted:', email.value)
  // Add your logic here
  email.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navigation -->
    <nav class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="text-2xl font-800 text-indigo-600">
          YourBrand
        </div>
        <div class="hidden md:flex gap-8">
          <a href="#features" class="text-gray-700 hover:text-indigo-600 transition">Features</a>
          <a href="#pricing" class="text-gray-700 hover:text-indigo-600 transition">Pricing</a>
          <a href="#about" class="text-gray-700 hover:text-indigo-600 transition">About</a>
        </div>
        <div class="flex gap-4">
          <button class="btn-secondary">Sign In</button>
          <button class="btn">Get Started</button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="container mx-auto px-6 py-20 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-800 text-gray-900 mb-6">
          Build Amazing Things with
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Vue & UnoCSS
          </span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
          A modern landing page template built with Vue 3, UnoCSS, and Vite.
          Fast, flexible, and ready to customize.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="px-6 py-3 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none w-full sm:w-80"
          />
          <button @click="handleSubmit" class="btn whitespace-nowrap w-full sm:w-auto">
            Start Free Trial
          </button>
        </div>
        <p class="text-sm text-gray-500 mt-4">No credit card required. 14-day free trial.</p>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="container mx-auto px-6 py-20">
      <h2 class="text-4xl font-800 text-center text-gray-900 mb-4">
        Why Choose Us?
      </h2>
      <p class="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
        Everything you need to build modern web applications with confidence.
      </p>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div :class="feature.icon" class="text-4xl text-indigo-600 mb-4"></div>
          <h3 class="text-xl font-600 text-gray-900 mb-2">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="container mx-auto px-6 py-20">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 md:p-16 text-center text-white shadow-2xl">
        <h2 class="text-4xl md:text-5xl font-800 mb-6">
          Ready to Get Started?
        </h2>
        <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of developers building amazing products with our platform.
        </p>
        <button class="bg-white text-indigo-600 px-8 py-4 rounded-lg font-600 text-lg hover:bg-gray-100 transition">
          Start Building Now
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="container mx-auto px-6 py-12 border-t border-gray-200">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div class="text-xl font-800 text-indigo-600 mb-4">YourBrand</div>
          <p class="text-gray-600 text-sm">Building the future, one component at a time.</p>
        </div>
        <div>
          <h4 class="font-600 text-gray-900 mb-4">Product</h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-indigo-600 transition">Features</a></li>
            <li><a href="#" class="hover:text-indigo-600 transition">Pricing</a></li>
            <li><a href="#" class="hover:text-indigo-600 transition">Documentation</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-600 text-gray-900 mb-4">Company</h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-indigo-600 transition">About</a></li>
            <li><a href="#" class="hover:text-indigo-600 transition">Blog</a></li>
            <li><a href="#" class="hover:text-indigo-600 transition">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-600 text-gray-900 mb-4">Legal</h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-indigo-600 transition">Privacy</a></li>
            <li><a href="#" class="hover:text-indigo-600 transition">Terms</a></li>
            <li><a href="#" class="hover:text-indigo-600 transition">Security</a></li>
          </ul>
        </div>
      </div>
      <div class="text-center text-sm text-gray-500 pt-8 border-t border-gray-200">
        © 2025 YourBrand. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Any custom styles if needed - UnoCSS handles most styling */
</style>
