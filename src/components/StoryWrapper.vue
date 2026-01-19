<template>
  <div
    class="story-wrapper"
    ref="wrapperRef"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @touchmove="handleTouchMove"
    @click="handleClick"
  >
    <!-- Progress Bar -->
    <div class="story-header">
      <VerticalProgressBar
        :total-slides="totalSlides"
        :current-slide="currentSlide"
        :progress="progress"
        :is-paused="isPaused"
        :clickable="allowProgressClick"
        @segment-click="goToSlide"
      />

      <!-- Optional header slot -->
      <slot name="header" :current-slide="currentSlide" />
    </div>

    <!-- Slides Container -->
    <div class="slides-container" ref="slidesContainer">
      <StorySlide
        v-for="(slide, index) in slides"
        :key="slide.id || index"
        :is-active="currentSlide === index"
        :direction="transitionDirection"
        :animation-type="getAnimationType(index)"
        :animation-duration="animationDuration"
        @animation-complete="handleAnimationComplete"
        @animation-start="handleAnimationStart"
      >
        <template #default="{ isActive, triggerAnimation }">
          <slot
            :name="`slide-${index}`"
            :slide="slide"
            :index="index"
            :is-active="isActive"
            :trigger-animation="triggerAnimation"
            :complete-action="completeAction"
            :waiting-for-action="waitingForAction"
          >
            <!-- Default slide content -->
            <div class="default-slide-content" :style="{ padding: props.paddingContent }">
              <h2>{{ slide.title }}</h2>
              <p>{{ slide.content }}</p>
            </div>
          </slot>
        </template>
      </StorySlide>
    </div>

    <!-- Navigation Overlays (invisible touch zones) -->
    <div v-if="!disableNavigation" class="nav-overlay nav-previous" @click.stop="previousSlide" />
    <div v-if="!disableNavigation" class="nav-overlay nav-next" @click.stop="nextSlide" />

    <!-- Optional footer slot -->
    <div class="story-footer">
      <slot
        name="footer"
        :current-slide="currentSlide"
        :is-paused="isPaused"
        :toggle-pause="togglePause"
      />
    </div>

    <!-- Loading overlay -->
    <transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <slot name="loading">
          <div class="loading-spinner"></div>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import VerticalProgressBar from './VerticalProgressBar.vue'
import StorySlide from './StorySlide.vue'
import { useStoryProgress } from '../composables/useStoryProgress'

const props = defineProps({
  slides: {
    type: Array,
    required: true,
    validator: (slides) => slides.length > 0,
  },
  slideDuration: {
    type: Number,
    default: 10,
  },
  animationDuration: {
    type: Number,
    default: 0.6,
  },
  autoStart: {
    type: Boolean,
    default: true,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  pauseOnHover: {
    type: Boolean,
    default: false,
  },
  allowProgressClick: {
    type: Boolean,
    default: true,
  },
  disableNavigation: {
    type: Boolean,
    default: false,
  },
  swipeThreshold: {
    type: Number,
    default: 50,
  },
  defaultAnimationType: {
    type: String,
    default: 'fade-slide',
  },
  paddingContent: {
    type: String,
    default: '2rem',
  },
})

const emit = defineEmits(['slide-change', 'story-complete', 'story-start', 'pause', 'resume'])

// Refs
const wrapperRef = ref(null)
const slidesContainer = ref(null)
const isLoading = ref(false)
const transitionDirection = ref('next')

// Touch handling
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const isSwiping = ref(false)

// Computed
const totalSlides = computed(() => props.slides.length)

/**
 * Get slide configuration
 */
const getSlideConfig = (index) => {
  return props.slides[index] || {}
}

/**
 * Story progress composable
 */
const {
  currentSlide,
  progress,
  isPaused,
  isTransitioning,
  isFirstSlide,
  isLastSlide,
  waitingForAction,
  startProgress,
  nextSlide: goNext,
  previousSlide: goPrevious,
  goToSlide: jumpToSlide,
  pause,
  resume,
  togglePause,
  reset,
  completeAction,
} = useStoryProgress({
  totalSlides: totalSlides.value,
  duration: props.slideDuration,
  onSlideChange: handleSlideChange,
  onComplete: handleStoryComplete,
  getSlideConfig,
})

/**
 * Get animation type for specific slide
 */
const getAnimationType = (index) => {
  const slide = props.slides[index]
  return slide.animationType || props.defaultAnimationType
}

/**
 * Handle slide change
 */
function handleSlideChange(newIndex, direction) {
  transitionDirection.value = direction
  emit('slide-change', {
    index: newIndex,
    slide: props.slides[newIndex],
    direction,
  })
}

/**
 * Handle story completion
 */
function handleStoryComplete() {
  emit('story-complete')

  if (props.loop) {
    reset()
  }
}

/**
 * Wrapper methods for navigation
 */
const nextSlide = () => {
  if (!isTransitioning.value && !isLastSlide.value) {
    goNext()
  }
}

const previousSlide = () => {
  if (!isTransitioning.value && !isFirstSlide.value) {
    goPrevious()
  }
}

const goToSlide = (index) => {
  if (!isTransitioning.value) {
    jumpToSlide(index)
  }
}

/**
 * Touch event handlers for mobile swipe
 */
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isSwiping.value = true

  // Pause on touch
  if (!isPaused.value) {
    pause()
  }
}

const handleTouchMove = (e) => {
  if (!isSwiping.value) return

  touchEndX.value = e.touches[0].clientX
  touchEndY.value = e.touches[0].clientY
}

const handleTouchEnd = () => {
  if (!isSwiping.value) return

  isSwiping.value = false

  const deltaX = touchEndX.value - touchStartX.value
  const deltaY = touchEndY.value - touchStartY.value

  // Check if horizontal swipe is dominant
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (Math.abs(deltaX) > props.swipeThreshold) {
      if (deltaX > 0) {
        // Swipe right - previous slide
        previousSlide()
      } else {
        // Swipe left - next slide
        nextSlide()
      }
    }
  }

  // Resume after touch
  setTimeout(() => {
    if (isPaused.value) {
      resume()
    }
  }, 100)
}

/**
 * Click handler for pause/resume
 */
const handleClick = (e) => {
  // Only toggle pause on center area clicks (not nav zones)
  const rect = wrapperRef.value.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const centerZone = rect.width * 0.3

  if (clickX > centerZone && clickX < rect.width - centerZone) {
    togglePause()
    emit(isPaused.value ? 'pause' : 'resume')
  }
}

/**
 * Animation lifecycle handlers
 */
const handleAnimationStart = (type) => {
  if (type === 'enter') {
    isLoading.value = true
  }
}

const handleAnimationComplete = (type) => {
  if (type === 'enter') {
    isLoading.value = false
  }
}

/**
 * Hover handlers
 */
const handleMouseEnter = () => {
  if (props.pauseOnHover && !isPaused.value) {
    pause()
  }
}

const handleMouseLeave = () => {
  if (props.pauseOnHover && isPaused.value) {
    resume()
  }
}

/**
 * Keyboard navigation
 */
const handleKeydown = (e) => {
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault()
      nextSlide()
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault()
      previousSlide()
      break
    case ' ':
      e.preventDefault()
      togglePause()
      break
    case 'Escape':
      e.preventDefault()
      pause()
      break
  }
}

/**
 * Lifecycle hooks
 */
onMounted(() => {
  if (props.autoStart) {
    startProgress()
    emit('story-start')
  }

  // Add keyboard listeners
  window.addEventListener('keydown', handleKeydown)

  // Add hover listeners
  if (props.pauseOnHover && wrapperRef.value) {
    wrapperRef.value.addEventListener('mouseenter', handleMouseEnter)
    wrapperRef.value.addEventListener('mouseleave', handleMouseLeave)
  }

  // Entrance animation for wrapper
  if (wrapperRef.value) {
    gsap.from(wrapperRef.value, {
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      ease: 'power2.out',
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)

  if (props.pauseOnHover && wrapperRef.value) {
    wrapperRef.value.removeEventListener('mouseenter', handleMouseEnter)
    wrapperRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }
})

// Expose methods for parent components
defineExpose({
  currentSlide,
  progress,
  isPaused,
  waitingForAction,
  nextSlide,
  previousSlide,
  goToSlide,
  pause,
  resume,
  togglePause,
  reset,
  startProgress,
  completeAction,
})
</script>

<style scoped>
.story-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  max-height: 100dvh; /* Dynamic viewport height for mobile */
  overflow: hidden;
  background: #000;
  touch-action: pan-y pinch-zoom;
  user-select: none;
  -webkit-user-select: none;
}

.story-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
  padding-top: env(safe-area-inset-top);
}

.slides-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.story-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Navigation overlays */
.nav-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 30%;
  z-index: 50;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.nav-previous {
  left: 0;
}

.nav-next {
  right: 0;
}

.nav-overlay:active {
  background: rgba(255, 255, 255, 0.05);
}

/* Default slide content */
.default-slide-content {
  padding: 2rem;
  color: white;
  text-align: center;
  max-width: 90%;
}

.default-slide-content h2 {
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.default-slide-content p {
  font-size: clamp(1rem, 3vw, 1.5rem);
  line-height: 1.6;
  opacity: 0.9;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  pointer-events: none;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .story-wrapper {
    max-width: 100vw;
  }

  .nav-overlay {
    width: 35%;
  }

  .default-slide-content {
    padding: 1.5rem;
  }
}

/* Tablet and desktop */
@media (min-width: 769px) {
  .story-wrapper {
    max-width: 480px;
    margin: 0 auto;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .story-header {
    border-radius: 12px 12px 0 0;
  }

  .story-footer {
    border-radius: 0 0 12px 12px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .story-wrapper * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Safe area insets for notched devices */
@supports (padding: env(safe-area-inset-top)) {
  .story-header {
    padding-top: env(safe-area-inset-top);
  }

  .story-footer {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
