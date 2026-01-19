<template>
  <div class="birthday-outro" ref="outroRef">
    <div class="outro-container">
      <!-- Animated gift box -->
      <div class="gift-box" ref="giftRef" @click="openGift">
        <div class="gift-lid" :class="{ 'is-open': isOpen }">
          <div class="bow">🎀</div>
        </div>
        <div class="gift-body"></div>

        <!-- Gift particles when opened -->
        <div v-if="isOpen" class="gift-particles">
          <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)">
            {{ getParticleEmoji(i) }}
          </div>
        </div>
      </div>

      <!-- Final message -->
      <div class="outro-content">
        <h2 class="outro-title" ref="titleRef">
          {{ finalMessage }}
        </h2>

        <p class="outro-subtitle" ref="subtitleRef">
          {{ subMessage }}
        </p>

        <!-- Share button -->
        <div class="outro-actions" ref="actionsRef">
          <button class="btn-share" @click="handleShare">
            <span class="btn-icon">📤</span>
            <span>Share Your Story</span>
          </button>

          <button class="btn-replay" @click="handleReplay">
            <span class="btn-icon">🔄</span>
            <span>Watch Again</span>
          </button>
        </div>

        <!-- Social badges -->
        <div class="social-badges" ref="badgesRef">
          <div class="badge">
            <span class="badge-icon">💝</span>
            <span class="badge-label">Emoria</span>
          </div>
          <div class="badge">
            <span class="badge-icon">🎂</span>
            <span class="badge-label">Birthday 2026</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  finalMessage: {
    type: String,
    default: "Here's to another amazing year!",
  },
  subMessage: {
    type: String,
    default: 'May your birthday be filled with love, laughter, and unforgettable moments',
  },
  isActive: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['share', 'replay'])

// Refs
const outroRef = ref<HTMLElement | null>(null)
const giftRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const actionsRef = ref<HTMLElement | null>(null)
const badgesRef = ref<HTMLElement | null>(null)

const isOpen = ref(false)

const particleEmojis = ['✨', '🎊', '🎉', '💫', '⭐', '🌟', '🎈', '💝']

/**
 * Get particle emoji
 */
const getParticleEmoji = (index: number) => {
  return particleEmojis[index % particleEmojis.length]
}

/**
 * Get particle styles
 */
const getParticleStyle = (index: number) => {
  const angle = (360 / 20) * index
  const distance = 80 + Math.random() * 40
  const tx = Math.cos((angle * Math.PI) / 180) * distance
  const ty = Math.sin((angle * Math.PI) / 180) * distance
  const rotation = Math.random() * 360
  const delay = index * 0.03

  return {
    '--tx': `${tx}px`,
    '--ty': `${ty}px`,
    '--rotation': `${rotation}deg`,
    animationDelay: `${delay}s`,
  }
}

/**
 * Open gift animation
 */
const openGift = () => {
  if (isOpen.value) return

  isOpen.value = true

  const tl = gsap.timeline()

  // Shake gift
  tl.to(giftRef.value, {
    rotation: -5,
    duration: 0.1,
    repeat: 5,
    yoyo: true,
  })

  // Pop open
  tl.to('.gift-lid', {
    y: -50,
    rotation: -20,
    duration: 0.5,
    ease: 'back.out(2)',
  })

  // Celebrate
  tl.from(
    '.gift-particles .particle',
    {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.03,
      ease: 'back.out(1.7)',
    },
    '-=0.3',
  )
}

/**
 * Handle share
 */
const handleShare = () => {
  // Button press animation
  gsap.to('.btn-share', {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      emit('share')
    },
  })
}

/**
 * Handle replay
 */
const handleReplay = () => {
  // Button press animation
  gsap.to('.btn-replay', {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      emit('replay')
    },
  })
}

/**
 * Play entrance animation
 */
const playEntranceAnimation = () => {
  const tl = gsap.timeline()

  // Gift box entrance
  tl.from(giftRef.value, {
    scale: 0,
    rotation: -180,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)',
  })

  // Subtle floating
  tl.to(giftRef.value, {
    y: -15,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })

  // Title
  tl.from(
    titleRef.value,
    {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    },
    '-=1.3',
  )

  // Subtitle
  tl.from(
    subtitleRef.value,
    {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    },
    '-=0.5',
  )

  // Actions
  if (actionsRef.value) {
    tl.from(
      actionsRef.value.children,
      {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: 'back.out(1.5)',
      },
      '-=0.3',
    )
  }

  // Badges
  if (badgesRef.value) {
    tl.from(
      badgesRef.value.children,
      {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'back.out(1.7)',
      },
      '-=0.4',
    )
  }

  return tl
}

/**
 * Watch for active state
 */
watch(
  () => props.isActive,
  (isActive) => {
    if (isActive) {
      isOpen.value = false
      playEntranceAnimation()
    }
  },
)

/**
 * Mount
 */
onMounted(() => {
  if (props.isActive) {
    playEntranceAnimation()
  }
})

defineExpose({
  playEntranceAnimation,
})
</script>

<style scoped>
.birthday-outro {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% 200%;
  animation: gradient-shift 10s ease infinite;
  position: relative;
  overflow: hidden;
  padding-top: 80px;
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

.outro-container {
  padding: 2rem;
  text-align: center;
  max-width: 90%;
}

/* Gift box */
.gift-box {
  width: 150px;
  height: 150px;
  margin: 0 auto 3rem;
  position: relative;
  cursor: pointer;
  perspective: 1000px;
}

.gift-body {
  width: 100%;
  height: 100px;
  background: linear-gradient(135deg, #ff6b9d 0%, #c239b3 100%);
  border-radius: 12px;
  position: absolute;
  bottom: 0;
  box-shadow: 0 20px 40px rgba(194, 57, 179, 0.3);
}

.gift-body::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
}

.gift-body::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
}

.gift-lid {
  width: 110%;
  height: 40px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-radius: 12px 12px 6px 6px;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  transition: transform 0.5s ease;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
  transform-origin: bottom center;
}

.gift-lid.is-open {
  transform: translateX(-50%) translateY(-50px) rotate(-20deg);
}

.bow {
  font-size: 3rem;
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
}

/* Gift particles */
.gift-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.particle {
  position: absolute;
  font-size: 1.5rem;
  animation: particle-burst 1s ease-out forwards;
}

@keyframes particle-burst {
  0% {
    transform: translate(0, 0) scale(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rotation));
    opacity: 0;
  }
}

/* Content */
.outro-content {
  max-width: 500px;
  margin: 0 auto;
}

.outro-title {
  font-size: clamp(2rem, 6vw, 2.5rem);
  font-weight: 900;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.outro-subtitle {
  font-size: clamp(1rem, 3vw, 1.1rem);
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 2.5rem;
  font-weight: 500;
}

/* Actions */
.outro-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.btn-share {
  background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
}

.btn-share:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 212, 255, 0.4);
}

.btn-replay {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-replay:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Social badges */
.social-badges {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.badge-icon {
  font-size: 1.2rem;
}

.badge-label {
  font-size: 0.85rem;
  color: white;
  font-weight: 600;
}

/* Mobile optimization */
@media (max-width: 768px) {
  .outro-container {
    padding: 1.5rem;
  }

  .gift-box {
    width: 120px;
    height: 120px;
    margin-bottom: 2rem;
  }

  .gift-body {
    height: 80px;
  }

  .gift-lid {
    height: 35px;
  }

  .bow {
    font-size: 2.5rem;
    top: -20px;
  }

  .particle {
    font-size: 1.2rem;
  }

  .outro-actions {
    gap: 0.75rem;
  }

  button {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
}
</style>
