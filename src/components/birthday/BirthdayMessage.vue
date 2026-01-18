<template>
  <div class="birthday-message" ref="messageRef">
    <div class="message-container">
      <!-- Decorative elements -->
      <div class="sparkles" ref="sparklesRef">
        <span v-for="i in 12" :key="i" class="sparkle">✨</span>
      </div>

      <!-- Message content -->
      <div class="message-content">
        <div class="message-icon" ref="iconRef">
          💝
        </div>

        <div class="message-text" ref="textRef">
          <p 
            v-for="(line, index) in messageLines"
            :key="index"
            class="message-line"
            :ref="el => setLineRef(el, index)"
          >
            {{ line }}
          </p>
        </div>

        <div class="message-signature" ref="signatureRef">
          <p class="from-label">With love,</p>
          <p class="from-name">{{ senderName }}</p>
        </div>
      </div>

      <!-- Floating hearts -->
      <div class="hearts" ref="heartsRef">
        <div 
          v-for="i in 15"
          :key="i"
          class="heart"
          :style="getHeartStyle(i)"
        >
          ❤️
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { gsap } from 'gsap';

const props = defineProps({
  message: {
    type: String,
    default: 'On your special day, I want you to know how much you mean to me. Your smile lights up every room, and your kindness touches everyone around you. May this year bring you endless joy and beautiful moments.'
  },
  senderName: {
    type: String,
    default: 'Your Friends'
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

// Refs
const messageRef = ref(null);
const iconRef = ref(null);
const textRef = ref(null);
const signatureRef = ref(null);
const sparklesRef = ref(null);
const heartsRef = ref(null);
const lineRefs = ref([]);

/**
 * Split message into lines
 */
const messageLines = computed(() => {
  return props.message.split('. ').filter(line => line.length > 0);
});

/**
 * Set line ref
 */
const setLineRef = (el, index) => {
  if (el) {
    lineRefs.value[index] = el;
  }
};

/**
 * Get heart styles
 */
const getHeartStyle = (index) => {
  const left = 10 + (index * 5);
  const delay = index * 0.3;
  const duration = 4 + Math.random() * 2;
  
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};

/**
 * Play entrance animation
 */
const playEntranceAnimation = () => {
  const tl = gsap.timeline();

  // Icon entrance
  tl.from(iconRef.value, {
    scale: 0,
    rotation: -180,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(2)'
  });

  // Sparkles burst
  tl.from('.sparkle', {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    stagger: {
      each: 0.05,
      from: 'random'
    },
    ease: 'back.out(1.7)'
  }, '-=0.4');

  // Message lines with typewriter effect
  lineRefs.value.forEach((line, index) => {
    tl.from(line, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    }, `-=${index === 0 ? 0.2 : 0.4}`);
  });

  // Signature
  tl.from(signatureRef.value, {
    scale: 0.8,
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'back.out(1.5)'
  }, '-=0.3');

  // Hearts float in
  tl.from('.heart', {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    stagger: {
      each: 0.08,
      from: 'random'
    },
    ease: 'back.out(1.5)'
  }, '-=0.8');

  return tl;
};

/**
 * Watch for active state
 */
watch(() => props.isActive, (isActive) => {
  if (isActive) {
    playEntranceAnimation();
  }
});

/**
 * Mount
 */
onMounted(() => {
  if (props.isActive) {
    playEntranceAnimation();
  }
});

defineExpose({
  playEntranceAnimation
});
</script>

<style scoped>
.birthday-message {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  position: relative;
  overflow: hidden;
  padding-top: 80px;
}

.message-container {
  padding: 2rem;
  max-width: 85%;
  position: relative;
}

/* Sparkles */
.sparkles {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  z-index: 5;
}

.sparkle {
  font-size: 1.5rem;
  animation: sparkle-twinkle 1.5s ease-in-out infinite alternate;
}

@keyframes sparkle-twinkle {
  0% { opacity: 0.3; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1.2); }
}

/* Content */
.message-content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 3rem 2rem;
  text-align: center;
  border: 3px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
}

.message-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: pulse-heart 2s ease-in-out infinite;
}

@keyframes pulse-heart {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Message text */
.message-text {
  margin-bottom: 2rem;
}

.message-line {
  font-size: clamp(1rem, 3vw, 1.1rem);
  line-height: 1.8;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 500;
}

.message-line:last-child {
  margin-bottom: 0;
}

/* Signature */
.message-signature {
  padding-top: 1.5rem;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
}

.from-label {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.from-name {
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  font-weight: 700;
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Hearts */
.hearts {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.heart {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.6;
  animation: heart-float linear infinite;
}

@keyframes heart-float {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

/* Mobile optimization */
@media (max-width: 768px) {
  .message-container {
    padding: 1.5rem;
    max-width: 90%;
  }
  
  .message-content {
    padding: 2rem 1.5rem;
    border-radius: 24px;
  }
  
  .message-icon {
    font-size: 3rem;
  }
  
  .sparkles {
    gap: 10px;
  }
  
  .sparkle {
    font-size: 1.2rem;
  }
  
  .heart {
    font-size: 1.2rem;
  }
}
</style>
