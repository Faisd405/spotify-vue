<template>
  <div class="emoria-birthday-wrapper">
    <!-- 9:16 Aspect Ratio Container -->
    <div class="story-frame">
      <StoryWrapper
        ref="storyRef"
        :slides="birthdaySlides"
        :slide-duration="6"
        :animation-duration="0.8"
        :auto-start="true"
        :pause-on-hover="false"
        default-animation-type="fade-slide"
        @slide-change="handleSlideChange"
        @story-complete="handleComplete"
      >
        <!-- Slide 0: Intro -->
        <template #slide-0="{ isActive }">
          <BirthdayIntro
            :recipient-name="recipientName"
            :birth-date="birthDate"
            :is-active="isActive"
          />
        </template>

        <!-- Slide 1: Memories -->
        <template #slide-1="{ isActive }">
          <BirthdayMemories :memories="memories" :quote="memoriesQuote" :is-active="isActive" />
        </template>

        <!-- Slide 2: Message -->
        <template #slide-2="{ isActive }">
          <BirthdayMessage
            :message="personalMessage"
            :sender-name="senderName"
            :is-active="isActive"
          />
        </template>

        <!-- Slide 3: Wish -->
        <template #slide-3="{ isActive, completeAction }">
          <BirthdayWish
            ref="wishRef"
            :wish-text="wishText"
            :is-active="isActive"
            @wish-blown="
              () => {
                handleWishBlown()
                completeAction()
              }
            "
            @click="handleWishClick"
          />
        </template>

        <!-- Slide 4: Outro -->
        <template #slide-4="{ isActive, completeAction }">
          <BirthdayOutro
            :final-message="finalMessage"
            :sub-message="subMessage"
            :is-active="isActive"
            @share="
              (platform) => {
                handleShare(platform)
                completeAction()
              }
            "
            @replay="handleReplay"
          />
        </template>
      </StoryWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StoryWrapper from '../components/StoryWrapper.vue'
import BirthdayIntro from '../components/birthday/BirthdayIntro.vue'
import BirthdayMemories from '../components/birthday/BirthdayMemories.vue'
import BirthdayMessage from '../components/birthday/BirthdayMessage.vue'
import BirthdayWish from '../components/birthday/BirthdayWish.vue'
import BirthdayOutro from '../components/birthday/BirthdayOutro.vue'

interface StoryWrapperRef {
  completeAction: () => void
  reset: () => void
}

interface WishRef {
  blowCandle: () => void
}

// Refs
const storyRef = ref<StoryWrapperRef | null>(null)
const wishRef = ref<WishRef | null>(null)

// Configuration
const recipientName = ref('Faiz')
const birthDate = ref('January 19, 2026')
const senderName = ref('Your Friends & Family')

const memories = ref([
  { icon: '🎬', count: '47', label: 'Movies Watched' },
  { icon: '☕', count: '156', label: 'Coffee Dates' },
  { icon: '🎵', count: '2,847', label: 'Songs Shared' },
  { icon: '📸', count: '289', label: 'Photos Taken' },
])

const memoriesQuote = ref('Every moment with you is a celebration')

const personalMessage = ref(
  'On your special day, I want you to know how much you mean to me. Your smile lights up every room, and your kindness touches everyone around you. May this year bring you endless joy and beautiful moments.',
)

const wishText = ref('May all your dreams come true this year and beyond')

const finalMessage = ref("Here's to another amazing year!")
const subMessage = ref('May your birthday be filled with love, laughter, and unforgettable moments')

// Slide configuration
const birthdaySlides = ref([
  { id: 'intro', animationType: 'scale-fade' },
  { id: 'memories', animationType: 'fade-slide' },
  { id: 'message', animationType: 'blur-zoom' },
  { id: 'wish', animationType: 'elastic', requiresAction: true },
  { id: 'outro', animationType: 'morph', requiresAction: true },
])

/**
 * Handle slide change
 */
const handleSlideChange = ({ index, direction }: { index: number; direction: string }) => {
  if (birthdaySlides.value[index]) {
    console.log(`Slide ${index} - ${birthdaySlides.value[index].id}`, direction)
  }
}

/**
 * Handle wish click
 */
const handleWishClick = () => {
  if (wishRef.value) {
    wishRef.value.blowCandle()
  }
}

/**
 * Handle wish blown
 */
const handleWishBlown = () => {
  console.log('Wish blown! 🎉')

  // Complete action to trigger auto-advance
  setTimeout(() => {
    if (storyRef.value) {
      storyRef.value.completeAction()
    }
  }, 1500)
}

/**
 * Handle story complete
 */
const handleComplete = () => {
  console.log('Birthday story completed! 🎂')
}

/**
 * Handle share
 */
const handleShare = (platform?: string) => {
  console.log('Sharing birthday story...', platform ? `via ${platform}` : '')

  // Complete action after sharing
  setTimeout(() => {
    if (storyRef.value) {
      storyRef.value.completeAction()
    }
  }, 800)

  // Implement Web Share API or custom share logic
  if (navigator.share) {
    navigator
      .share({
        title: `${recipientName.value}'s Birthday 2026`,
        text: 'Check out this amazing birthday story!',
        url: window.location.href,
      })
      .catch((err) => console.log('Share cancelled', err))
  } else {
    alert('Share: Copy link or use social media buttons')
  }
}

/**
 * Handle replay
 */
const handleReplay = () => {
  if (storyRef.value) {
    storyRef.value.reset()
  }
}
</script>

<style scoped>
.emoria-birthday-wrapper {
  width: 100%;
  min-height: 100vh;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* 9:16 Aspect Ratio Frame (Instagram Stories) */
.story-frame {
  position: relative;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 9 / 16;
  background: #000;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
}

/* Custom Header */
.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem 0.5rem;
  position: relative;
  z-index: 110;
}

.btn-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-close:hover {
  background: rgba(0, 0, 0, 0.5);
  transform: scale(1.1);
}

.btn-close:active {
  transform: scale(0.95);
}

.slide-indicator {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.emoria-logo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-icon {
  font-size: 1rem;
}

.logo-text {
  font-size: 0.85rem;
  color: white;
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* Mobile optimization - Full screen on mobile */
@media (max-width: 768px) {
  .emoria-birthday-wrapper {
    padding: 0;
  }

  .story-frame {
    max-width: 100%;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    border-radius: 0;
    aspect-ratio: auto;
  }

  .custom-header {
    padding-top: max(1rem, env(safe-area-inset-top));
  }
}

/* Desktop - Center with max width */
@media (min-width: 769px) {
  .story-frame {
    max-width: 450px;
    max-height: 800px;
  }
}

/* Extra large screens */
@media (min-width: 1440px) {
  .story-frame {
    max-width: 500px;
    max-height: 889px;
  }
}
</style>
