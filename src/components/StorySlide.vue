<template>
  <div
    class="story-slide"
    :class="[
      slideClass,
      `animation-${animationType}`,
      {
        'is-active': isActive,
        'is-exiting': isExiting,
        'is-entering': isEntering,
        'slide-forward': direction === 'next',
        'slide-backward': direction === 'previous',
      },
    ]"
    ref="slideRef"
  >
    <slot
      :is-active="isActive"
      :direction="direction"
      :trigger-animation="triggerAnimation"
      :style="{ padding: props.paddingContent }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
  direction: {
    type: String,
    default: 'next',
    validator: (value) => ['next', 'previous'].includes(value),
  },
  animationType: {
    type: String,
    default: 'fade-slide',
    validator: (value) =>
      [
        'fade-slide',
        'scale-fade',
        'rotate-fade',
        'blur-zoom',
        'flip',
        'elastic',
        'split-reveal',
        'morph',
      ].includes(value),
  },
  animationDuration: {
    type: Number,
    default: 0.6,
  },
  slideClass: {
    type: String,
    default: '',
  },
  paddingContent: {
    type: String,
    default: '2rem',
  },
})

const emit = defineEmits(['animation-complete', 'animation-start'])

const slideRef = ref(null)
const isEntering = ref(false)
const isExiting = ref(false)
const animationTimeline = ref(null)

/**
 * Animation presets for different slide types
 */
const animations = {
  'fade-slide': {
    enter: (el, direction) => {
      const xOffset = direction === 'next' ? 100 : -100
      return gsap.fromTo(
        el,
        {
          opacity: 0,
          x: xOffset,
          scale: 0.95,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: props.animationDuration,
          ease: 'power3.out',
        },
      )
    },
    exit: (el, direction) => {
      const xOffset = direction === 'next' ? -50 : 50
      return gsap.to(el, {
        opacity: 0,
        x: xOffset,
        scale: 0.95,
        duration: props.animationDuration * 0.8,
        ease: 'power3.in',
      })
    },
  },

  'scale-fade': {
    enter: (el) => {
      return gsap.fromTo(
        el,
        {
          opacity: 0,
          scale: 0.8,
          rotationY: 15,
        },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: props.animationDuration,
          ease: 'back.out(1.2)',
        },
      )
    },
    exit: (el) => {
      return gsap.to(el, {
        opacity: 0,
        scale: 1.1,
        duration: props.animationDuration * 0.6,
        ease: 'power2.in',
      })
    },
  },

  'rotate-fade': {
    enter: (el, direction) => {
      const rotation = direction === 'next' ? 90 : -90
      return gsap.fromTo(
        el,
        {
          opacity: 0,
          rotationY: rotation,
          z: -200,
        },
        {
          opacity: 1,
          rotationY: 0,
          z: 0,
          duration: props.animationDuration,
          ease: 'power2.out',
        },
      )
    },
    exit: (el, direction) => {
      const rotation = direction === 'next' ? -45 : 45
      return gsap.to(el, {
        opacity: 0,
        rotationY: rotation,
        z: -100,
        duration: props.animationDuration * 0.7,
        ease: 'power2.in',
      })
    },
  },

  'blur-zoom': {
    enter: (el) => {
      return gsap.fromTo(
        el,
        {
          opacity: 0,
          scale: 1.3,
          filter: 'blur(20px)',
        },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: props.animationDuration,
          ease: 'power3.out',
        },
      )
    },
    exit: (el) => {
      return gsap.to(el, {
        opacity: 0,
        scale: 0.9,
        filter: 'blur(10px)',
        duration: props.animationDuration * 0.5,
        ease: 'power2.in',
      })
    },
  },

  flip: {
    enter: (el, direction) => {
      const rotationY = direction === 'next' ? 180 : -180
      return gsap.fromTo(
        el,
        {
          opacity: 0,
          rotationY: rotationY,
          transformOrigin: '50% 50%',
        },
        {
          opacity: 1,
          rotationY: 0,
          duration: props.animationDuration * 1.2,
          ease: 'power2.out',
        },
      )
    },
    exit: (el) => {
      return gsap.to(el, {
        opacity: 0,
        scale: 0.8,
        duration: props.animationDuration * 0.5,
        ease: 'power2.in',
      })
    },
  },

  elastic: {
    enter: (el, direction) => {
      const yOffset = direction === 'next' ? 100 : -100
      return gsap.fromTo(
        el,
        {
          opacity: 0,
          y: yOffset,
          scale: 0.7,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: props.animationDuration * 1.3,
          ease: 'elastic.out(1, 0.6)',
        },
      )
    },
    exit: (el, direction) => {
      const yOffset = direction === 'next' ? -30 : 30
      return gsap.to(el, {
        opacity: 0,
        y: yOffset,
        duration: props.animationDuration * 0.6,
        ease: 'power2.in',
      })
    },
  },

  'split-reveal': {
    enter: (el) => {
      return gsap.fromTo(
        el,
        {
          opacity: 0,
          clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
          scale: 1.2,
        },
        {
          opacity: 1,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scale: 1,
          duration: props.animationDuration,
          ease: 'power3.out',
        },
      )
    },
    exit: (el) => {
      return gsap.to(el, {
        opacity: 0,
        clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
        duration: props.animationDuration * 0.7,
        ease: 'power2.in',
      })
    },
  },

  morph: {
    enter: (el) => {
      return gsap.fromTo(
        el,
        {
          opacity: 0,
          borderRadius: '50%',
          scale: 0,
          rotation: 180,
        },
        {
          opacity: 1,
          borderRadius: '0%',
          scale: 1,
          rotation: 0,
          duration: props.animationDuration * 1.2,
          ease: 'back.out(1.5)',
        },
      )
    },
    exit: (el) => {
      return gsap.to(el, {
        opacity: 0,
        scale: 0.5,
        rotation: -90,
        duration: props.animationDuration * 0.6,
        ease: 'back.in(1.5)',
      })
    },
  },
}

/**
 * Trigger custom animation from parent
 */
const triggerAnimation = (customAnimation) => {
  if (slideRef.value && customAnimation) {
    customAnimation(slideRef.value, props.direction)
  }
}

/**
 * Play enter animation
 */
const playEnterAnimation = async () => {
  if (!slideRef.value) return

  isEntering.value = true
  emit('animation-start', 'enter')

  const animation = animations[props.animationType]
  if (animation && animation.enter) {
    animationTimeline.value = animation.enter(slideRef.value, props.direction)

    await animationTimeline.value

    isEntering.value = false
    emit('animation-complete', 'enter')
  }
}

/**
 * Play exit animation
 */
const playExitAnimation = async () => {
  if (!slideRef.value) return

  isExiting.value = true
  emit('animation-start', 'exit')

  const animation = animations[props.animationType]
  if (animation && animation.exit) {
    animationTimeline.value = animation.exit(slideRef.value, props.direction)

    await animationTimeline.value

    isExiting.value = false
    emit('animation-complete', 'exit')
  }
}

/**
 * Watch for active state changes
 */
watch(
  () => props.isActive,
  async (isActive, wasActive) => {
    await nextTick()

    if (isActive && !wasActive) {
      // Slide is becoming active - play enter animation
      playEnterAnimation()
    } else if (!isActive && wasActive) {
      // Slide is becoming inactive - play exit animation
      playExitAnimation()
    }
  },
)

/**
 * Initial setup
 */
onMounted(() => {
  if (props.isActive && slideRef.value) {
    // If initially active, set to visible state
    gsap.set(slideRef.value, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    })
  } else if (slideRef.value) {
    // If not active, set to hidden state
    gsap.set(slideRef.value, {
      opacity: 0,
    })
  }
})

defineExpose({
  triggerAnimation,
  playEnterAnimation,
  playExitAnimation,
})
</script>

<style scoped>
.story-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  will-change: transform, opacity;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.story-slide:not(.is-active) {
  pointer-events: none;
  user-select: none;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .story-slide {
    /* Hardware acceleration for smoother animations */
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .story-slide {
    animation: none !important;
    transition: opacity 0.3s ease !important;
  }

  .story-slide.is-entering,
  .story-slide.is-exiting {
    transition: opacity 0.3s ease;
  }
}
</style>
