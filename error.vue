<template>
  <div>
    <!-- Include the NavBar for consistent navigation -->
    <NavBar />
    
    <div class="error-page min-h-[calc(100vh-80px)] pt-20 overflow-hidden">
      <!-- Animated background elements -->
      <div class="fashion-elements">
        <div v-for="n in 8" :key="n" class="fashion-element" :style="`--delay: ${n * 0.5}s; --size: ${20 + n * 5}px; --speed: ${10 + n * 2}s`"></div>
      </div>
      
      <div class="container mx-auto p-6 min-h-[calc(100vh-160px)] flex items-center justify-center relative z-10">
        <div class="max-w-3xl mx-auto text-center space-y-8">
          <!-- Enhanced animated 404 display with glitch effect -->
          <div class="error-animation relative">
            <div class="text-9xl font-bold tracking-tighter glitch" data-text="404">
              <span class="inline-block transform hover:scale-110 transition-transform duration-300 text-[120px] md:text-[150px]">4</span>
              <span class="text-red-500 inline-block animate-bounce hover:animate-ping text-[120px] md:text-[150px]">0</span>
              <span class="inline-block transform hover:scale-110 transition-transform duration-300 text-[120px] md:text-[150px]">4</span>
            </div>
            <div class="absolute -bottom-4 left-0 right-0 mx-auto w-32 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
          </div>
          
          <h1 class="text-4xl md:text-5xl font-bold text-gradient">Ooops! Denne side er ude af sæson</h1>
          
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Det ser ud til, at du har fundet en digital blindgyde.
            Siden du leder efter findes ikke eller er flyttet.
          </p>
          
         
          <p class="text-lg text-gray-500 max-w-2xl mx-auto mt-2">
            Dette kan skyldes et forældet link eller en tastefejl i URL'en.
          </p>
          
          <!-- Bestseller-specific message with enhanced styling -->
          <div class="quote-card bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-100 shadow-md transform hover:scale-[1.02] transition-all">
            <div class="quote-marks">"</div>
            <p class="text-gray-700 italic relative z-10">
              Fashion er ikke bare om tøj, det handler om at finde den rette vej - lad os hjælpe dig tilbage på sporet.
            </p>
            <p class="text-sm text-gray-500 mt-2 font-medium">— Bestseller Team</p>
          </div>
          
          <div class="space-y-3 pt-4">
            <p class="text-gray-500 font-medium">Prøv disse trendy destinationer i stedet:</p>
            <div class="flex flex-wrap justify-center gap-4 pt-2">
              <NuxtLink 
                to="/products"
                class="nav-button px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all hover:shadow-md"
              >
                🛍️ Udforsk kollektionen
              </NuxtLink>
              <NuxtLink 
                to="/"
                class="nav-button px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all hover:shadow-md"
              >
                🏠 Tilbage til forsiden
              </NuxtLink>
              <NuxtLink 
                to="/cart"
                class="nav-button px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all hover:shadow-md"
              >
                🛒 Se din shoppingkurv
              </NuxtLink>
            </div>
          </div>
          
          <div class="pt-8 border-t border-gray-200">
            <button 
              @click="goBack"
              class="back-button px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all hover:shadow-md group"
            >
              <span class="inline-block group-hover:-translate-x-1 transition-transform">👈</span> Forrige outfit
            </button>
          </div>
          
          <!-- Enhanced search box -->
          <div class="mt-8 max-w-md mx-auto">
            <p class="mb-2 text-gray-600">Leder du efter noget specifikt?</p>
            <div class="relative search-container">
              <input 
                type="text" 
                placeholder="Find dit næste yndlingsstykke..." 
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                aria-label="Søg efter produkter"
              />
              <button 
                @click="handleSearch"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 transition-all"
                aria-label="Søg"
              >
                Søg
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-1">Prøv f.eks. "jakke", "kjole" eller "jeans"</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NavBar from '~/components/navigation/NavBar.vue';

const searchQuery = ref('');
let mouseMoveListener = null;

const goBack = () => {
  window.history.length > 1 ? window.history.back() : navigateTo('/');
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/products?search=${encodeURIComponent(searchQuery.value.trim())}`);
  }
};

onMounted(() => {
  // Add mouse follow effect for fashion elements
  mouseMoveListener = (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    document.querySelectorAll('.fashion-element').forEach(element => {
      const offsetX = (mouseX - 0.5) * 40;
      const offsetY = (mouseY - 0.5) * 40;
      element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  };
  
  document.addEventListener('mousemove', mouseMoveListener);
});

// Ryd op efter event listeners når komponenten fjernes
onUnmounted(() => {
  if (mouseMoveListener) {
    document.removeEventListener('mousemove', mouseMoveListener);
  }
});
</script>

<style scoped>
.error-page {
  background-color: #f9fafb;
  background-image: 
    radial-gradient(#e5e7eb 1px, transparent 1px),
    radial-gradient(#e5e7eb 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
  position: relative;
}

.error-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #000, #ef4444, #000);
}

/* Fashion floating elements */
.fashion-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.fashion-element {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background-color: rgba(239, 68, 68, 0.05);
  border-radius: 50%;
  animation: float var(--speed) ease-in-out infinite;
  animation-delay: var(--delay);
  transition: transform 0.3s ease-out;
}

.fashion-element:nth-child(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.fashion-element:nth-child(1) { top: 10%; left: 10%; }
.fashion-element:nth-child(2) { top: 20%; left: 80%; }
.fashion-element:nth-child(3) { top: 60%; left: 15%; }
.fashion-element:nth-child(4) { top: 70%; left: 75%; }
.fashion-element:nth-child(5) { top: 30%; left: 30%; }
.fashion-element:nth-child(6) { top: 80%; left: 50%; }
.fashion-element:nth-child(7) { top: 40%; left: 90%; }
.fashion-element:nth-child(8) { top: 50%; left: 5%; }

.error-animation {
  position: relative;
  margin-bottom: 2rem;
}

/* Glitch effect */
.glitch {
  position: relative;
  color: #000;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.glitch::before {
  color: #ef4444;
  animation: glitch-effect 3s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  transform: translate(-5px, 0);
}

.glitch::after {
  color: #3b82f6;
  animation: glitch-effect 2s infinite;
  clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
  transform: translate(5px, 0);
}

@keyframes glitch-effect {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

/* Gradient text */
.text-gradient {
  background: linear-gradient(90deg, #000, #ef4444, #000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: textGradient 5s linear infinite;
}

@keyframes textGradient {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

/* Quote card */
.quote-card {
  position: relative;
  overflow: hidden;
}

.quote-marks {
  position: absolute;
  top: -20px;
  left: 10px;
  font-size: 120px;
  font-family: Georgia, serif;
  color: rgba(239, 68, 68, 0.1);
  line-height: 1;
}

/* Button effects */
.nav-button, .back-button {
  position: relative;
  overflow: hidden;
}

.nav-button::after, .back-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.nav-button:hover::after, .back-button:hover::after {
  transform: translateX(0);
}

/* Search container */
.search-container {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.search-container:focus-within {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@media (prefers-reduced-motion: reduce) {
  .glitch::before,
  .glitch::after,
  .text-gradient,
  .fashion-element,
  .error-animation {
    animation: none !important;
  }
}

/* Forbedret tilgængelighed for fokus-tilstande */
input:focus, button:focus {
  outline: 2px solid #000;
  outline-offset: 2px;
}

/* Tilføj en mere synlig hover-effekt på knapper for bedre feedback */
.nav-button:hover, .back-button:hover {
  transform: translateY(-2px);
}
</style> 