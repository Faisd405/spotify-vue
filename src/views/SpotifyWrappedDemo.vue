<template>
  <div class="spotify-wrapped-demo">
    <StoryWrapper
      ref="storyWrapperRef"
      :slides="storySlides"
      :slide-duration="5"
      :animation-duration="0.8"
      :auto-start="true"
      :pause-on-hover="true"
      @slide-change="handleSlideChange"
      @story-complete="handleStoryComplete"
    >
      <!-- Story Slide 1: Welcome -->
      <template #slide-0="{ isActive }">
        <div class="slide slide-welcome" :class="{ 'is-active': isActive }">
          <div class="slide-content">
            <h1 class="slide-title fade-in-up">Your 2026</h1>
            <h2 class="slide-subtitle fade-in-up delay-1">Wrapped</h2>
            <div class="logo-pulse fade-in delay-2">
              <div class="wrapped-logo">
                <span>🎵</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Story Slide 2: Top Artist -->
      <template #slide-1="{ isActive }">
        <div class="slide slide-top-artist" :class="{ 'is-active': isActive }">
          <div class="slide-content">
            <p class="slide-label fade-in-up">Your Top Artist</p>
            <h2 class="slide-title-large fade-in-up delay-1">The Weeknd</h2>
            <div class="stat-circle fade-in delay-2">
              <div class="stat-number">234</div>
              <div class="stat-label">hours listened</div>
            </div>
          </div>
          <div class="gradient-bg gradient-purple"></div>
        </div>
      </template>

      <!-- Story Slide 3: Top Song -->
      <template #slide-2="{ isActive }">
        <div class="slide slide-top-song" :class="{ 'is-active': isActive }">
          <div class="slide-content">
            <p class="slide-label fade-in-up">Your Top Song</p>
            <h2 class="slide-title-large fade-in-up delay-1">Blinding Lights</h2>
            <p class="slide-subtitle fade-in-up delay-2">by The Weeknd</p>
            <div class="play-count fade-in delay-3">
              <span class="count-number">847</span>
              <span class="count-label">plays</span>
            </div>
          </div>
          <div class="gradient-bg gradient-blue"></div>
        </div>
      </template>

      <!-- Story Slide 4: Minutes Listened -->
      <template #slide-3="{ isActive }">
        <div class="slide slide-minutes" :class="{ 'is-active': isActive }">
          <div class="slide-content">
            <p class="slide-label fade-in-up">You listened to</p>
            <h1 class="slide-mega-number fade-in-scale delay-1">52,847</h1>
            <p class="slide-subtitle fade-in-up delay-2">minutes of music</p>
            <p class="slide-detail fade-in delay-3">
              That's like watching your favorite movie 440 times! 🎬
            </p>
          </div>
          <div class="gradient-bg gradient-green"></div>
        </div>
      </template>

      <!-- Story Slide 5: Genre Mix -->
      <template #slide-4="{ isActive }">
        <div class="slide slide-genres" :class="{ 'is-active': isActive }">
          <div class="slide-content">
            <p class="slide-label fade-in-up">Your Top Genres</p>
            <div class="genre-list">
              <div
                v-for="(genre, idx) in topGenres"
                :key="idx"
                class="genre-item fade-in-left"
                :style="{ animationDelay: `${idx * 0.15}s` }"
              >
                <span class="genre-rank">{{ idx + 1 }}</span>
                <span class="genre-name">{{ genre.name }}</span>
                <span class="genre-bar">
                  <span class="genre-bar-fill" :style="{ width: genre.percentage + '%' }"></span>
                </span>
                <span class="genre-percent">{{ genre.percentage }}%</span>
              </div>
            </div>
          </div>
          <div class="gradient-bg gradient-orange"></div>
        </div>
      </template>

      <!-- Final Slide: Shareable Card with Special Transition -->
      <template #slide-5="{ isActive }">
        <div
          class="slide slide-shareable-card"
          :class="{ 'is-active': isActive }"
          ref="shareableCardRef"
        >
          <div class="card-container">
            <!-- The shareable card -->
            <div class="shareable-card">
              <div class="card-header">
                <h3>My 2026 Wrapped</h3>
                <span class="card-year">2026</span>
              </div>

              <div class="card-stats">
                <div class="card-stat">
                  <div class="card-stat-value">234</div>
                  <div class="card-stat-label">hours</div>
                </div>
                <div class="card-stat">
                  <div class="card-stat-value">847</div>
                  <div class="card-stat-label">top song plays</div>
                </div>
                <div class="card-stat">
                  <div class="card-stat-value">52K</div>
                  <div class="card-stat-label">minutes</div>
                </div>
              </div>

              <div class="card-footer">
                <p class="card-tagline">My music year in review</p>
                <div class="card-logo">🎵 Spotify Wrapped</div>
              </div>
            </div>

            <!-- Share buttons -->
            <div class="share-actions fade-in delay-4">
              <button class="btn-share btn-primary" @click="handleShare">
                <span class="btn-icon">📤</span>
                Share Your Wrapped
              </button>
              <button class="btn-share btn-secondary" @click="handleReplay">
                <span class="btn-icon">🔄</span>
                Replay
              </button>
            </div>
          </div>

          <div class="gradient-bg gradient-rainbow"></div>

          <!-- Confetti effect -->
          <div v-if="showConfetti" class="confetti-container">
            <div v-for="i in 50" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
          </div>
        </div>
      </template>

      <!-- Header slot -->
      <template #header="{ currentSlide }">
        <div class="story-header-content">
          <button class="btn-close" @click="handleClose">
            <span>✕</span>
          </button>
          <div class="slide-counter">{{ currentSlide + 1 }} / {{ storySlides.length }}</div>
        </div>
      </template>
    </StoryWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import StoryWrapper from '../components/StoryWrapper.vue'

interface StoryWrapperRef {
  reset: () => void
}

// Refs
const storyWrapperRef = ref<StoryWrapperRef | null>(null)
const shareableCardRef = ref<HTMLElement | null>(null)
const showConfetti = ref(false)

// Story slides configuration
const storySlides = ref([
  { id: 'welcome', animationType: 'scale-fade' },
  { id: 'top-artist', animationType: 'fade-slide' },
  { id: 'top-song', animationType: 'blur-zoom' },
  { id: 'minutes', animationType: 'elastic' },
  { id: 'genres', animationType: 'fade-slide' },
  { id: 'shareable', animationType: 'morph' }, // Special animation for final card
])

// Sample data
const topGenres = [
  { name: 'Pop', percentage: 35 },
  { name: 'R&B', percentage: 28 },
  { name: 'Electronic', percentage: 22 },
  { name: 'Hip Hop', percentage: 15 },
]

/**
 * Handle slide change with special logic for final card
 */
const handleSlideChange = ({ index, direction }: { index: number; direction: string }) => {
  console.log(`Slide changed to ${index}, direction: ${direction}`)

  // Special transition TO the shareable card (from story to card)
  if (index === storySlides.value.length - 1) {
    triggerShareableCardEntrance()
  }

  // Special transition FROM the shareable card (back to story)
  if (index === storySlides.value.length - 2 && direction === 'previous') {
    hideShareableCard()
  }
}

/**
 * Trigger special entrance animation for shareable card
 * This is the key transition: Story -> Shareable Card
 */
const triggerShareableCardEntrance = () => {
  console.log('Triggering shareable card entrance')

  // Wait a moment for the slide transition to start
  setTimeout(() => {
    if (!shareableCardRef.value) return

    const card = shareableCardRef.value.querySelector('.shareable-card') as HTMLElement
    const actions = shareableCardRef.value.querySelector('.share-actions') as HTMLElement

    // Create master timeline for coordinated animations
    const tl = gsap.timeline({
      onComplete: () => {
        // Show confetti after card is fully visible
        showConfetti.value = true
        setTimeout(() => {
          showConfetti.value = false
        }, 3000)
      },
    })

    // Animate card entrance with 3D transform
    tl.fromTo(
      card,
      {
        opacity: 0,
        scale: 0.3,
        rotationY: -180,
        rotationX: 20,
        z: -500,
        transformOrigin: '50% 50%',
      },
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        z: 0,
        duration: 1.2,
        ease: 'back.out(1.5)',
      },
    )

    // Animate card stats in sequence
    const stats = card.querySelectorAll('.card-stat')
    stats.forEach((stat: Element, idx: number) => {
      tl.fromTo(
        stat,
        {
          opacity: 0,
          y: 30,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(2)',
        },
        `-=${0.8 - idx * 0.2}`, // Stagger with overlap
      )
    })

    // Animate share buttons
    tl.fromTo(
      actions,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.3',
    )

    // Add subtle floating animation to card
    tl.to(card, {
      y: -10,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })
  }, 200)
}

/**
 * Hide shareable card when navigating away
 */
const hideShareableCard = () => {
  showConfetti.value = false

  if (!shareableCardRef.value) return

  const card = shareableCardRef.value.querySelector('.shareable-card') as HTMLElement
  if (!card) return

  gsap.to(card, {
    scale: 0.8,
    opacity: 0,
    rotationY: 90,
    duration: 0.5,
    ease: 'power2.in',
  })
}

/**
 * Handle story completion
 */
const handleStoryComplete = () => {
  console.log('Story completed!')
  // Keep showing the shareable card
}

/**
 * Get random confetti styles
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getConfettiStyle = (_index?: number) => {
  const colors = ['#1DB954', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  const randomX = Math.random() * 100
  const randomDelay = Math.random() * 0.5
  const randomDuration = 2 + Math.random() * 2

  return {
    left: `${randomX}%`,
    backgroundColor: randomColor,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`,
  }
}

/**
 * Handle share action
 */
const handleShare = () => {
  console.log('Sharing wrapped...')

  // Trigger share animation
  const card = shareableCardRef.value?.querySelector('.shareable-card')
  if (card) {
    gsap.to(card, {
      scale: 1.05,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    })
  }

  // Implement your share logic here
  alert('Share functionality - integrate with Web Share API or social platforms')
}

/**
 * Handle replay action
 */
const handleReplay = () => {
  if (storyWrapperRef.value) {
    storyWrapperRef.value.reset()
  }
}

/**
 * Handle close
 */
const handleClose = () => {
  console.log('Closing wrapped...')
  // Implement close logic
}

/**
 * Component mounted
 */
onMounted(() => {
  console.log('Spotify Wrapped Demo mounted')
})
</script>

<style scoped>
.spotify-wrapped-demo {
  width: 100%;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

/* Slide base styles */
.slide {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
}

.slide-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  max-width: 90%;
}

/* Gradient backgrounds */
.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.gradient-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-blue {
  background: linear-gradient(135deg, #667eea 0%, #00d4ff 100%);
}

.gradient-green {
  background: linear-gradient(135deg, #1db954 0%, #0f7e36 100%);
}

.gradient-orange {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.gradient-rainbow {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 25%,
    #f093fb 50%,
    #f5576c 75%,
    #1db954 100%
  );
  animation: gradient-shift 10s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Typography */
.slide-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  opacity: 0.8;
  margin-bottom: 1rem;
  font-weight: 600;
}

.slide-title {
  font-size: clamp(3rem, 12vw, 6rem);
  font-weight: 900;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.slide-subtitle {
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
  opacity: 0.95;
}

.slide-title-large {
  font-size: clamp(2rem, 10vw, 5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.slide-mega-number {
  font-size: clamp(3.5rem, 15vw, 8rem);
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(90deg, #fff 0%, #a8e6cf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 1rem 0;
}

.slide-detail {
  font-size: 1.1rem;
  opacity: 0.8;
  margin-top: 2rem;
  line-height: 1.6;
}

/* Welcome slide */
.logo-pulse {
  margin-top: 3rem;
}

.wrapped-logo {
  font-size: 5rem;
  animation: pulse-scale 2s ease-in-out infinite;
}

@keyframes pulse-scale {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Stats */
.stat-circle {
  margin-top: 3rem;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

.play-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  padding: 1.5rem 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.count-number {
  font-size: 3rem;
  font-weight: 900;
}

.count-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Genre list */
.genre-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.genre-item {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 1rem;
  align-items: center;
}

.genre-rank {
  font-size: 1.5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.5);
}

.genre-name {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: left;
}

.genre-bar {
  width: 100px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.genre-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 1s ease-out;
}

.genre-percent {
  font-size: 1rem;
  font-weight: 700;
  min-width: 50px;
  text-align: right;
}

/* Shareable Card */
.card-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.shareable-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  color: #191414;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(25, 20, 20, 0.1);
}

.card-header h3 {
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0;
}

.card-year {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1db954;
}

.card-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card-stat {
  text-align: center;
}

.card-stat-value {
  font-size: 2rem;
  font-weight: 900;
  color: #1db954;
  line-height: 1;
}

.card-stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
  margin-top: 0.5rem;
}

.card-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 2px solid rgba(25, 20, 20, 0.1);
}

.card-tagline {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 0.75rem;
}

.card-logo {
  font-size: 1rem;
  font-weight: 700;
}

/* Share actions */
.share-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-share {
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #1db954 0%, #0f7e36 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(29, 185, 84, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(29, 185, 84, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Confetti */
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  opacity: 0;
  animation: confetti-fall linear forwards;
}

@keyframes confetti-fall {
  0% {
    top: -10px;
    opacity: 1;
    transform: translateX(0) rotateZ(0deg);
  }
  100% {
    top: 100vh;
    opacity: 0;
    transform: translateX(100px) rotateZ(720deg);
  }
}

/* Header content */
.story-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem 0;
}

.btn-close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.slide-counter {
  font-size: 0.9rem;
  color: white;
  opacity: 0.8;
  font-weight: 600;
}

/* Animations */
.fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

.fade-in-scale {
  animation: fadeInScale 1s ease-out forwards;
  opacity: 0;
}

.fade-in-left {
  animation: fadeInLeft 0.6s ease-out forwards;
  opacity: 0;
}

.delay-1 {
  animation-delay: 0.2s;
}
.delay-2 {
  animation-delay: 0.4s;
}
.delay-3 {
  animation-delay: 0.6s;
}
.delay-4 {
  animation-delay: 0.8s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .slide {
    padding: 1.5rem;
  }

  .card-container {
    max-width: 90%;
  }

  .shareable-card {
    padding: 2rem 1.5rem;
  }

  .card-stats {
    gap: 1rem;
  }

  .genre-list {
    max-width: 100%;
  }
}
</style>
