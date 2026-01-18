<template>
  <div class="birthday-wish" ref="wishRef">
    <div class="wish-container">
      <!-- Candle animation -->
      <div class="candle-wrapper" ref="candleRef">
        <div class="candle">
          <div class="flame" ref="flameRef"></div>
          <div class="candle-body"></div>
        </div>
      </div>

      <!-- Wish text -->
      <div class="wish-content">
        <h2 class="wish-title" ref="titleRef">Make a Wish</h2>
        
        <div class="wish-text" ref="textRef">
          <p class="wish-line">{{ wishText }}</p>
        </div>

        <!-- Blow instruction -->
        <div class="blow-instruction" ref="instructionRef">
          <p class="instruction-text">Tap to blow out the candle</p>
          <div class="tap-indicator">👇</div>
        </div>
      </div>

      <!-- Confetti after blow -->
      <div v-if="isBlown" class="confetti-burst" ref="confettiRef">
        <div 
          v-for="i in 30"
          :key="i"
          class="confetti-piece"
          :style="getConfettiStyle(i)"
        ></div>
      </div>

      <!-- Success message -->
      <transition name="fade-scale">
        <div v-if="isBlown" class="success-message" ref="successRef">
          <div class="success-icon">🎊</div>
          <p class="success-text">Wish granted!</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { gsap } from 'gsap';

const props = defineProps({
  wishText: {
    type: String,
    default: 'May all your dreams come true this year and beyond'
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['wish-blown']);

// Refs
const wishRef = ref(null);
const candleRef = ref(null);
const flameRef = ref(null);
const titleRef = ref(null);
const textRef = ref(null);
const instructionRef = ref(null);
const confettiRef = ref(null);
const successRef = ref(null);

const isBlown = ref(false);

/**
 * Get confetti styles
 */
const getConfettiStyle = (index) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce', '#85c1e2'];
  const angle = (360 / 30) * index;
  const distance = 150 + Math.random() * 100;
  
  return {
    backgroundColor: colors[index % colors.length],
    '--tx': `${Math.cos(angle * Math.PI / 180) * distance}px`,
    '--ty': `${Math.sin(angle * Math.PI / 180) * distance}px`,
    '--rotation': `${Math.random() * 720}deg`
  };
};

/**
 * Play entrance animation
 */
const playEntranceAnimation = () => {
  const tl = gsap.timeline();

  // Candle grows from bottom
  tl.from(candleRef.value, {
    scaleY: 0,
    transformOrigin: 'bottom center',
    duration: 0.8,
    ease: 'back.out(1.5)'
  });

  // Flame appears
  tl.from(flameRef.value, {
    scale: 0,
    opacity: 0,
    duration: 0.4,
    ease: 'back.out(2)'
  }, '-=0.2');

  // Title
  tl.from(titleRef.value, {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.3');

  // Wish text
  tl.from(textRef.value, {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.3');

  // Instruction
  tl.from(instructionRef.value, {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.3');

  return tl;
};

/**
 * Blow out candle
 */
const blowCandle = () => {
  if (isBlown.value) return;

  isBlown.value = true;
  
  const tl = gsap.timeline({
    onComplete: () => {
      emit('wish-blown');
    }
  });

  // Flame flickers and disappears
  tl.to(flameRef.value, {
    scaleX: 1.5,
    scaleY: 0.5,
    duration: 0.1,
    repeat: 3,
    yoyo: true
  });

  tl.to(flameRef.value, {
    scale: 0,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in'
  });

  // Hide instruction
  tl.to(instructionRef.value, {
    opacity: 0,
    y: -10,
    duration: 0.3
  }, '-=0.3');

  // Smoke effect (scale up candle body slightly)
  tl.to('.candle-body', {
    opacity: 0.5,
    duration: 0.5
  }, '-=0.2');

  // Success message appears
  setTimeout(() => {
    if (successRef.value) {
      gsap.from(successRef.value, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(2)'
      });
    }
  }, 500);
};

/**
 * Watch for active state
 */
watch(() => props.isActive, (isActive) => {
  if (isActive) {
    isBlown.value = false;
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
  playEntranceAnimation,
  blowCandle
});
</script>

<style scoped>
.birthday-wish {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  padding-top: 80px;
}

.wish-container {
  padding: 2rem;
  text-align: center;
  position: relative;
  z-index: 10;
}

/* Candle */
.candle-wrapper {
  margin-bottom: 3rem;
  display: flex;
  justify-content: center;
}

.candle {
  position: relative;
  width: 60px;
}

.flame {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 35px;
  background: radial-gradient(circle at 50% 60%, 
    #fff 0%, 
    #ffd700 20%, 
    #ff6b00 60%, 
    transparent 100%
  );
  border-radius: 50% 50% 20% 20%;
  animation: flame-flicker 0.2s ease-in-out infinite alternate;
  filter: blur(1px);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
}

@keyframes flame-flicker {
  0% { transform: translateX(-50%) scaleY(1) scaleX(1); }
  100% { transform: translateX(-50%) scaleY(1.1) scaleX(0.95); }
}

.candle-body {
  width: 60px;
  height: 120px;
  background: linear-gradient(180deg, #ff6b9d 0%, #c239b3 100%);
  border-radius: 8px 8px 12px 12px;
  position: relative;
  box-shadow: 0 10px 30px rgba(194, 57, 179, 0.4);
}

.candle-body::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 10px;
  background: #333;
  border-radius: 4px 4px 0 0;
}

/* Wish content */
.wish-content {
  max-width: 90%;
  margin: 0 auto;
}

.wish-title {
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 900;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.wish-text {
  margin-bottom: 2rem;
}

.wish-line {
  font-size: clamp(1.1rem, 3.5vw, 1.3rem);
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.8;
  font-weight: 500;
  max-width: 500px;
  margin: 0 auto;
}

/* Blow instruction */
.blow-instruction {
  animation: bounce-instruction 1.5s ease-in-out infinite;
}

@keyframes bounce-instruction {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.instruction-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.tap-indicator {
  font-size: 2rem;
  animation: tap-pulse 1s ease-in-out infinite;
}

@keyframes tap-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

/* Confetti */
.confetti-burst {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  animation: confetti-burst 1.5s ease-out forwards;
}

@keyframes confetti-burst {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) rotate(var(--rotation));
    opacity: 0;
  }
}

/* Success message */
.success-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.success-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: success-bounce 0.6s ease-out;
}

@keyframes success-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.success-text {
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 900;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* Transitions */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.2);
}

/* Mobile optimization */
@media (max-width: 768px) {
  .wish-container {
    padding: 1.5rem;
  }
  
  .candle-wrapper {
    margin-bottom: 2rem;
  }
  
  .candle {
    width: 50px;
  }
  
  .candle-body {
    width: 50px;
    height: 100px;
  }
  
  .success-icon {
    font-size: 4rem;
  }
}
</style>
