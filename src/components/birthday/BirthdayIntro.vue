<template>
  <div class="birthday-intro" ref="introRef">
    <div class="intro-container">
      <!-- Background decoration -->
      <div class="bg-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>

      <!-- Content -->
      <div class="intro-content">
        <div class="intro-icon" ref="iconRef">
          <span class="emoji">🎉</span>
        </div>
        
        <h1 class="intro-title" ref="titleRef">
          Happy Birthday
        </h1>
        
        <p class="intro-name" ref="nameRef">
          {{ recipientName }}
        </p>
        
        <p class="intro-subtitle" ref="subtitleRef">
          Your special day wrapped
        </p>
        
        <div class="intro-date" ref="dateRef">
          {{ formattedDate }}
        </div>
      </div>

      <!-- Particles -->
      <div class="particles" ref="particlesRef">
        <div 
          v-for="i in 20" 
          :key="i"
          class="particle"
          :style="getParticleStyle(i)"
        >
          {{ getParticleEmoji(i) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { gsap } from 'gsap';

const props = defineProps({
  recipientName: {
    type: String,
    default: 'Faiz'
  },
  birthDate: {
    type: String,
    default: 'January 19, 2026'
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

// Refs
const introRef = ref(null);
const iconRef = ref(null);
const titleRef = ref(null);
const nameRef = ref(null);
const subtitleRef = ref(null);
const dateRef = ref(null);
const particlesRef = ref(null);

const formattedDate = ref(props.birthDate);

const particleEmojis = ['🎈', '🎉', '🎊', '✨', '💫', '⭐', '🌟', '💝'];

/**
 * Get random particle emoji
 */
const getParticleEmoji = (index) => {
  return particleEmojis[index % particleEmojis.length];
};

/**
 * Get random particle styles
 */
const getParticleStyle = (index) => {
  const left = Math.random() * 100;
  const delay = Math.random() * 2;
  const duration = 3 + Math.random() * 2;
  
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

  // Background circles
  tl.from('.circle', {
    scale: 0,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: 'back.out(1.7)'
  });

  // Icon with bounce
  tl.from(iconRef.value, {
    scale: 0,
    rotation: -180,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(2)'
  }, '-=0.8');

  // Title with split animation
  tl.from(titleRef.value, {
    y: 50,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.4');

  // Name with scale
  tl.from(nameRef.value, {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.5)'
  }, '-=0.3');

  // Subtitle
  tl.from(subtitleRef.value, {
    y: 20,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.2');

  // Date
  tl.from(dateRef.value, {
    y: 20,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.2');

  // Particles burst
  tl.from('.particle', {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    stagger: {
      each: 0.05,
      from: 'random'
    },
    ease: 'back.out(1.5)'
  }, '-=0.6');

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
.birthday-intro {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  padding-top: 80px;
}

.intro-container {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
  max-width: 90%;
}

/* Background decoration */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(40px);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Content */
.intro-content {
  position: relative;
  z-index: 10;
}

.intro-icon {
  margin-bottom: 1.5rem;
}

.emoji {
  font-size: 5rem;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.intro-title {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 900;
  color: white;
  margin-bottom: 0.5rem;
  line-height: 1.1;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.intro-name {
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: 900;
  background: linear-gradient(90deg, #fff 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  line-height: 1;
  text-shadow: 0 4px 30px rgba(255, 215, 0, 0.3);
}

.intro-subtitle {
  font-size: clamp(1rem, 3vw, 1.3rem);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.intro-date {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  letter-spacing: 0.03em;
}

/* Particles */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.particle {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.7;
  animation: particle-float linear infinite;
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Mobile optimization */
@media (max-width: 768px) {
  .intro-container {
    padding: 1.5rem;
  }
  
  .emoji {
    font-size: 4rem;
  }
  
  .circle-1 {
    width: 200px;
    height: 200px;
  }
  
  .circle-2 {
    width: 150px;
    height: 150px;
  }
  
  .particle {
    font-size: 1.2rem;
  }
}
</style>
