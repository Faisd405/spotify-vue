<template>
  <div class="vertical-progress-container">
    <!-- Progress segments for each slide -->
    <div
      v-for="(segment, index) in segments"
      :key="index"
      class="progress-segment"
      :class="{
        'is-active': index === currentSlide,
        'is-completed': index < currentSlide,
        'is-upcoming': index > currentSlide,
      }"
      @click="onSegmentClick(index)"
    >
      <!-- Background track -->
      <div class="progress-track"></div>

      <!-- Animated fill -->
      <div
        class="progress-fill"
        :style="getFillStyle(index)"
        :ref="(el) => setFillRef(el, index)"
      ></div>

      <!-- Pulse indicator for active segment -->
      <div
        v-if="index === currentSlide && !isPaused"
        class="progress-pulse"
        :style="getPulseStyle()"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  totalSlides: { type: Number, required: true },
  currentSlide: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  isPaused: { type: Boolean, default: false },
  clickable: { type: Boolean, default: true },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (v) => ['vertical', 'horizontal'].includes(v),
  },
})

const emit = defineEmits(['segment-click', 'slide-change'])

const fillRefs = ref({})
const segments = computed(() => Array.from({ length: props.totalSlides }))

const axis = computed(() => (props.orientation === 'vertical' ? 'scaleY' : 'scaleX'))

const setFillRef = (el, index) => {
  if (el) fillRefs.value[index] = el
}

const getFillStyle = (index) => {
  if (index < props.currentSlide) {
    return { transform: `${axis.value}(1)` }
  }

  if (index === props.currentSlide) {
    const scale = Math.max(0, Math.min(props.progress / 100, 1))
    return { transform: `${axis.value}(${scale})` }
  }

  return { transform: `${axis.value}(0)` }
}

const getPulseStyle = () => {
  const progressPercent = Math.max(2, Math.min(props.progress, 98))

  if (props.orientation === 'vertical') {
    return { top: `${progressPercent}%` }
  }

  return { left: `${progressPercent}%` }
}

const onSegmentClick = (index) => {
  if (!props.clickable || index === props.currentSlide) return
  emit('segment-click', index)
  emit('slide-change', index)
}

watch(
  () => props.currentSlide,
  (to, from) => {
    if (from == null || to === from) return
    animateSegmentTransition(from, to)
  },
)

const animateSegmentTransition = (from, to) => {
  const forward = to > from

  if (forward) {
    const prev = fillRefs.value[from]
    if (prev) {
      gsap.to(prev, {
        [axis.value]: 1,
        duration: 0.2,
        ease: 'power2.out',
      })
    }
  } else {
    for (let i = from; i > to; i--) {
      const fill = fillRefs.value[i]
      if (fill) {
        gsap.to(fill, {
          [axis.value]: 0,
          duration: 0.15,
          ease: 'power2.in',
        })
      }
    }
  }
}

onMounted(() => {
  segments.value.forEach((_, i) => {
    const el = fillRefs.value[i]?.parentElement
    if (!el) return

    gsap.from(el, {
      y: props.orientation === 'horizontal' ? -6 : 0,
      x: props.orientation === 'vertical' ? -6 : 0,
      duration: 0.35,
      delay: i * 0.04,
      ease: 'power2.out',
    })
  })
})
</script>

<style scoped>
.vertical-progress-container {
  display: flex;
  gap: 8px;
  width: 100%;
  padding: 16px 20px;
}

.vertical-progress-container.vertical {
  flex-direction: column;
}

.vertical-progress-container.horizontal {
  flex-direction: row;
}

.progress-segment {
  position: relative;
  flex: 1;
  height: 4px;
}

.vertical .progress-segment {
  width: 4px;
  height: 100%;
}

.progress-segment {
  cursor: pointer;
}

.progress-segment.is-active {
  opacity: 1;
}

.progress-segment.is-upcoming {
  opacity: 0.5;
}

.progress-segment.is-completed {
  opacity: 1;
}

.progress-track,
.progress-fill {
  position: absolute;
  inset: 0;
  border-radius: 2px;
}

.progress-track {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
}

.progress-segment.is-active .progress-track,
.progress-segment.is-completed .progress-track {
  background: rgba(255, 255, 255, 0.4);
}

.progress-fill {
  background: white;
  transform-origin: left center;
  transform: scaleX(0);
  box-shadow:
    0 0 12px rgba(255, 255, 255, 0.7),
    0 0 20px rgba(255, 255, 255, 0.4);
  transition: box-shadow 0.3s ease;
}

.vertical .progress-fill {
  transform-origin: center top;
  transform: scaleY(0);
}

.progress-segment.is-active .progress-fill {
  background: white;
  box-shadow:
    0 0 16px rgba(255, 255, 255, 0.9),
    0 0 24px rgba(255, 255, 255, 0.5);
}

.progress-segment.is-completed .progress-fill {
  background: white;
  box-shadow:
    0 0 12px rgba(255, 255, 255, 0.7),
    0 0 20px rgba(255, 255, 255, 0.4);
}

.progress-pulse {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 1.5s infinite;
  pointer-events: none;
  z-index: 10;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.6);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}
</style>
