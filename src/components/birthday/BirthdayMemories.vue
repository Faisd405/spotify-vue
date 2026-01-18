<template>
  <div class="birthday-memories" ref="memoriesRef">
    <div class="memories-container">
      <!-- Title -->
      <div class="memories-header" ref="headerRef">
        <p class="label">This Year Together</p>
        <h2 class="title">Unforgettable Moments</h2>
      </div>

      <!-- Memory Cards -->
      <div class="memories-grid" ref="gridRef">
        <div
          v-for="(memory, index) in memories"
          :key="index"
          class="memory-card"
          :ref="(el) => setCardRef(el, index)"
        >
          <div class="memory-icon">{{ memory.icon }}</div>
          <div class="memory-count">{{ memory.count }}</div>
          <div class="memory-label">{{ memory.label }}</div>
        </div>
      </div>

      <!-- Quote -->
      <div class="memories-quote" ref="quoteRef">
        <p>"{{ quote }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { gsap } from "gsap";

const props = defineProps({
  memories: {
    type: Array,
    default: () => [
      { icon: "🎬", count: "47", label: "Movies Watched" },
      { icon: "☕", count: "156", label: "Coffee Dates" },
      { icon: "🎵", count: "2,847", label: "Songs Shared" },
      { icon: "📸", count: "289", label: "Photos Taken" },
    ],
  },
  quote: {
    type: String,
    default: "Every moment with you is a celebration",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

// Refs
const memoriesRef = ref(null);
const headerRef = ref(null);
const gridRef = ref(null);
const quoteRef = ref(null);
const cardRefs = ref([]);

/**
 * Set card ref
 */
const setCardRef = (el, index) => {
  if (el) {
    cardRefs.value[index] = el;
  }
};

/**
 * Play entrance animation
 */
const playEntranceAnimation = () => {
  const tl = gsap.timeline();

  // Header
  tl.from(headerRef.value.querySelectorAll(".label, .title"), {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "power3.out",
  });

  // Cards with stagger and counter animation
  tl.from(
    cardRefs.value,
    {
      scale: 0.8,
      opacity: 0,
      y: 50,
      rotationX: -15,
      duration: 0.6,
      stagger: {
        each: 0.15,
        from: "start",
      },
      ease: "back.out(1.5)",
    },
    "-=0.3",
  );

  // Animate numbers counting up
  cardRefs.value.forEach((card, index) => {
    const countElement = card.querySelector(".memory-count");
    const targetValue = props.memories[index].count.replace(/,/g, "");
    const hasComma = props.memories[index].count.includes(",");

    const obj = { value: 0 };
    tl.to(
      obj,
      {
        value: parseInt(targetValue),
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          const displayValue = Math.floor(obj.value);
          countElement.textContent = hasComma
            ? displayValue.toLocaleString()
            : displayValue.toString();
        },
      },
      "-=1.2",
    );
  });

  // Quote
  tl.from(
    quoteRef.value,
    {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    },
    "-=0.8",
  );

  return tl;
};

/**
 * Watch for active state
 */
watch(
  () => props.isActive,
  (isActive) => {
    if (isActive) {
      playEntranceAnimation();
    }
  },
);

/**
 * Mount
 */
onMounted(() => {
  if (props.isActive) {
    playEntranceAnimation();
  }
});

defineExpose({
  playEntranceAnimation,
});
</script>

<style scoped>
.birthday-memories {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  position: relative;
  overflow: hidden;
  padding: 60px 0 20px 0;
  box-sizing: border-box;
}

.memories-container {
  padding: 0 1.5rem;
  max-width: 90%;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.memories-header {
  text-align: center;
  flex-shrink: 0;
}

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 900;
  color: white;
  line-height: 1.1;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  margin: 0;
}

/* Grid */
.memories-grid {
  display: grid;
  flex-shrink: 0;
  margin-bottom: 3rem;
}

.memory-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.25rem 1 rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

.memory-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.memory-card:hover {
  transform: translateY(-5px);
}

.memory-icon {
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.memory-count {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 900;
  color: white;
  line-height: 1;
  margin-bottom: 0.35rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.memory-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  letter-spacing: 0.03em;
}

/* Quote */
.memories-quote {
  text-align: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.memories-quote p {
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  color: white;
  font-style: italic;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
}

/* birthday-memories {
    padding: 50px 0 15px 0;
  }

  .memories-container {
    padding: 0 1rem;
    gap: 1.25rem;
  }

  .memory-card {
    padding: 1rem 0.75rem;
  }

  .memory-icon {
    font-size: 2rem;
    margin-bottom: 0.4rem;
  }

  .memories-quote {
    padding: 0.85rem 1.25rem;
  }
}

@media (max-width: 480px) {
  .memories-grid {
    gap: 0.6rem;
  }

  .memory-card {
    padding: 0.85rem 0.6rem
  .memories-grid {
    grid-template-columns: 1fr;
  }
}
  */
</style>
