# Emoria Birthday Story Engine

> A cinematic, slide-based birthday experience inspired by Spotify Wrapped, built with Vue.js 3 and GSAP.

## 🎯 Architecture Overview

### **Component Structure**

```
src/
├── components/
│   ├── StoryWrapper.vue          # Core orchestrator (state, progress, navigation)
│   ├── VerticalProgressBar.vue   # Instagram-style progress indicators
│   ├── StorySlide.vue            # Base slide with GSAP transitions
│   └── birthday/
│       ├── BirthdayIntro.vue     # Slide 1: Welcome animation
│       ├── BirthdayMemories.vue  # Slide 2: Year stats with counters
│       ├── BirthdayMessage.vue   # Slide 3: Personal message
│       ├── BirthdayWish.vue      # Slide 4: Interactive candle
│       └── BirthdayOutro.vue     # Slide 5: Gift & share actions
├── composables/
│   └── useStoryProgress.js       # Progress logic, timing, auto-advance
├── examples/
│   └── EmoriaBirthdayDemo.vue    # Main birthday demo (9:16 ratio)
└── utils/
    └── gsapHelpers.js            # Animation utilities
```

---

## 🎬 Slide System

### **1. BirthdayIntro.vue**

**Purpose:** Welcome the birthday person with cinematic entrance

**Features:**

- Floating emoji icon with bounce animation
- Personalized name with gradient text
- Animated background circles
- Particle burst effect

**Props:**

```javascript
{
  recipientName: String,    // Default: 'Faiz'
  birthDate: String,        // Default: 'January 19, 2026'
  isActive: Boolean         // Triggers animations when true
}
```

**GSAP Animations:**

- Background circles: `back.out(1.7)` stagger
- Icon: Rotation + scale bounce
- Text: Sequential fade-up with stagger
- Particles: Random burst from center

---

### **2. BirthdayMemories.vue**

**Purpose:** Show year statistics with animated counters

**Features:**

- 2×2 grid of memory cards (glassmorphism)
- Counting animation from 0 to target
- Shimmer effect on cards
- Inspirational quote

**Props:**

```javascript
{
  memories: Array,          // [{ icon, count, label }]
  quote: String,
  isActive: Boolean
}
```

**GSAP Animations:**

- Cards: 3D rotation entrance with `back.out(1.5)`
- Numbers: Easing counter animation
- Quote: Delayed fade-in

**Default Memories:**

```javascript
;[
  { icon: '🎬', count: '47', label: 'Movies Watched' },
  { icon: '☕', count: '156', label: 'Coffee Dates' },
  { icon: '🎵', count: '2,847', label: 'Songs Shared' },
  { icon: '📸', count: '289', label: 'Photos Taken' },
]
```

---

### **3. BirthdayMessage.vue**

**Purpose:** Display heartfelt personal message

**Features:**

- Scrollable multi-line message
- Floating hearts animation
- Sparkle decorations
- Sender signature

**Props:**

```javascript
{
  message: String,          // Multi-sentence message
  senderName: String,       // Default: 'Your Friends'
  isActive: Boolean
}
```

**GSAP Animations:**

- Icon: Rotating bounce entrance
- Sparkles: Random burst with twinkle
- Message lines: Sequential typewriter effect
- Hearts: Continuous floating upward

---

### **4. BirthdayWish.vue**

**Purpose:** Interactive candle blowing experience

**Features:**

- Animated candle with flame flicker
- Tap/click to blow out
- Confetti burst on blow
- "Wish granted" success message

**Props:**

```javascript
{
  wishText: String,
  isActive: Boolean
}
```

**Events:**

```javascript
@wish-blown  // Emitted when candle is blown out
```

**GSAP Animations:**

- Candle: Grows from bottom with `back.out`
- Flame: Flicker loop with `sine.inOut`
- Blow sequence: Shake → Scale → Disappear
- Confetti: Radial burst with rotation

**Interaction Flow:**

1. Candle appears with flame
2. User taps anywhere
3. Flame flickers and disappears
4. Confetti explodes
5. Success message appears
6. Auto-advance to next slide after 2s

---

### **5. BirthdayOutro.vue**

**Purpose:** Final celebration with share actions

**Features:**

- Animated gift box (tap to open)
- Share & Replay buttons
- Emoria branding badges
- Gradient background animation

**Props:**

```javascript
{
  finalMessage: String,
  subMessage: String,
  isActive: Boolean
}
```

**Events:**

```javascript
@share   // User clicked share button
@replay  // User clicked replay button
```

**GSAP Animations:**

- Gift: Rotation entrance + floating loop
- Gift opening: Lid pops off with particles
- Buttons: Staggered entrance with bounce
- Badges: Scale pop-in

---

## 🎨 Animation Hooks

### **Entry Transitions (Per Slide)**

Each slide component exposes a `playEntranceAnimation()` method:

```javascript
// Example: Custom timing in parent
const slide = ref(null)

watch(isActive, (active) => {
  if (active) {
    slide.value.playEntranceAnimation()
  }
})
```

### **GSAP Timeline Composition**

All slides use GSAP timelines for orchestrated animations:

```javascript
const playEntranceAnimation = () => {
  const tl = gsap.timeline()

  // Element 1
  tl.from(element1, { opacity: 0, y: 30, duration: 0.6 })

  // Element 2 (overlapping)
  tl.from(element2, { scale: 0, duration: 0.5 }, '-=0.3')

  // Element 3 (stagger)
  tl.from('.items', {
    y: 20,
    opacity: 0,
    stagger: 0.1,
  })

  return tl
}
```

---

## 📱 Mobile-First Design

### **9:16 Aspect Ratio Lock**

The `EmoriaBirthdayDemo.vue` enforces Instagram Stories aspect ratio:

```css
.story-frame {
  width: 100%;
  max-width: 480px;
  aspect-ratio: 9 / 16; /* Lock to mobile portrait */
}

/* Mobile: Full screen */
@media (max-width: 768px) {
  .story-frame {
    width: 100vw;
    height: 100vh;
    height: 100dvh; /* Dynamic viewport */
    aspect-ratio: auto;
  }
}

/* Desktop: Centered with shadow */
@media (min-width: 769px) {
  .story-frame {
    max-width: 450px;
    border-radius: 16px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  }
}
```

### **Touch Optimizations**

```javascript
// Swipe gestures
handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  pause();  // Pause on touch
}

handleTouchEnd() {
  const deltaX = touchEndX - touchStartX;

  if (deltaX > threshold) {
    previousSlide();  // Swipe right
  } else if (deltaX < -threshold) {
    nextSlide();      // Swipe left
  }

  resume();  // Resume after release
}
```

---

## 🎮 State Management

### **StoryWrapper.vue**

The core orchestrator manages:

1. **Current Slide Index**

   ```javascript
   const currentSlide = ref(0)
   ```

2. **Auto-Progress Timer**

   ```javascript
   const progressTimeline = gsap.to(progress, {
     value: 100,
     duration: slideDuration,
     ease: 'none',
     onComplete: () => nextSlide(),
   })
   ```

3. **Pause/Resume**

   ```javascript
   const pause = () => {
     progressTimeline.pause()
     isPaused.value = true
   }
   ```

4. **Navigation**
   ```javascript
   const nextSlide = async () => {
     if (isTransitioning.value) return

     isTransitioning.value = true
     currentSlide.value++

     await gsap.to({}, { duration: 0.3 }) // Transition delay
     startProgress()
   }
   ```

---

## 🎯 Usage Example

### **Basic Implementation**

```vue
<template>
  <EmoriaBirthdayDemo />
</template>

<script setup lang="ts">
import EmoriaBirthdayDemo from './examples/EmoriaBirthdayDemo.vue'
</script>
```

### **Customized Configuration**

```vue
<template>
  <StoryWrapper :slides="slides" :slide-duration="6" @slide-change="handleSlideChange">
    <template #slide-0="{ isActive }">
      <BirthdayIntro recipient-name="Alex" birth-date="March 15, 2026" :is-active="isActive" />
    </template>

    <!-- Other slides... -->
  </StoryWrapper>
</template>

<script setup lang="ts">
const slides = ref([
  { id: 'intro', animationType: 'scale-fade' },
  { id: 'memories', animationType: 'blur-zoom' },
  // ...
])

const handleSlideChange = ({ index, direction }) => {
  console.log(`Now on slide ${index}`)

  // Track analytics
  trackEvent('birthday_slide_view', {
    slideIndex: index,
    slideName: slides.value[index].id,
  })
}
</script>
```

---

## 🎨 Customization Guide

### **1. Change Colors**

Each slide uses gradient backgrounds. Modify in component styles:

```css
/* BirthdayIntro.vue */
.birthday-intro {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* BirthdayMemories.vue */
.birthday-memories {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

### **2. Adjust Timing**

```vue
<!-- Slower slide duration -->
<StoryWrapper :slide-duration="8" />

<!-- Faster animations -->
<StoryWrapper :animation-duration="0.4" />
```

### **3. Custom Memories**

```javascript
const memories = ref([
  { icon: '🍕', count: '73', label: 'Pizza Nights' },
  { icon: '🎮', count: '429', label: 'Games Played' },
  { icon: '🏃', count: '1,234', label: 'Miles Run' },
  { icon: '📚', count: '42', label: 'Books Read' },
])
```

### **4. Add New Slide**

```vue
<!-- 1. Create component -->
<!-- components/birthday/BirthdayPhotos.vue -->
<template>
  <div class="birthday-photos">
    <!-- Your content -->
  </div>
</template>

<!-- 2. Register in demo -->
<script setup lang="ts">
import BirthdayPhotos from '../components/birthday/BirthdayPhotos.vue'

const slides = ref([
  // ...existing slides
  { id: 'photos', animationType: 'flip' },
])
</script>

<!-- 3. Add template slot -->
<template #slide-5="{ isActive }">
  <BirthdayPhotos :is-active="isActive" />
</template>
```

---

## 🚀 Performance Optimizations

### **1. Hardware Acceleration**

All animations use GPU-accelerated properties:

```css
.slide {
  transform: translateZ(0);
  will-change: transform, opacity;
  backface-visibility: hidden;
}
```

### **2. Animation Cleanup**

```javascript
onUnmounted(() => {
  if (progressTimeline) {
    progressTimeline.kill()
  }
  gsap.killTweensOf('*')
})
```

### **3. Lazy Loading**

```javascript
// Only animate when slide becomes active
watch(
  () => props.isActive,
  (isActive) => {
    if (isActive) {
      playEntranceAnimation()
    }
  },
)
```

---

## 📊 Events & Analytics

### **Track User Engagement**

```javascript
<StoryWrapper
  @slide-change="trackSlideView"
  @story-complete="trackCompletion"
  @pause="trackPause"
  @resume="trackResume"
>
```

### **Integration Example (Google Analytics)**

```javascript
const trackSlideView = ({ index, slide }) => {
  gtag('event', 'slide_view', {
    slide_index: index,
    slide_name: slide.id,
    timestamp: Date.now(),
  })
}

const trackCompletion = () => {
  gtag('event', 'story_complete', {
    duration_seconds: totalDuration,
    completion_rate: 100,
  })
}
```

---

## 🎁 Advanced Features

### **1. Dynamic Content Loading**

```javascript
const loadBirthdayData = async (userId) => {
  const data = await fetch(`/api/birthday/${userId}`)

  recipientName.value = data.name
  memories.value = data.yearStats
  personalMessage.value = data.customMessage
}
```

### **2. Video Backgrounds**

```vue
<div class="slide-background">
  <video autoplay loop muted playsinline>
    <source src="@/assets/birthday-bg.mp4" type="video/mp4">
  </video>
</div>
```

### **3. Audio Integration**

```javascript
import { Howl } from 'howler'

const bgMusic = new Howl({
  src: ['/audio/birthday-theme.mp3'],
  loop: true,
  volume: 0.5,
})

onMounted(() => {
  if (autoStart) {
    bgMusic.play()
  }
})
```

---

## 🔧 Tech Stack

- **Vue.js 3** - Composition API, Refs, Watchers
- **GSAP 3.12+** - Timeline-based animations
- **CSS** - Gradients, Glassmorphism, Animations
- **Mobile-First** - Responsive, Touch-optimized

---

## 📱 Browser Support

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

---

## 🎯 Next Steps

1. **Add Tailwind CSS** (if needed):

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init
   ```

2. **Deploy**:

   ```bash
   npm run build
   ```

3. **Customize** for your brand colors and content

---

**Built with ❤️ for Emoria** | High-End Digital Experiences
