# Spotify Wrapped-Style Transition System for Vue.js

A production-ready, mobile-first Vue.js component system for creating Instagram Stories-like vertical progress bars with GSAP-powered animations, optimized for Spotify Wrapped-style experiences.

## 🎯 Features

- **Instagram-Style Vertical Progress Bar** - Auto-advancing progress indicators with tap/click navigation
- **8+ Animation Presets** - Fade-slide, scale-fade, blur-zoom, elastic, flip, morph, and more
- **Story-to-Card Transition Logic** - Specialized 3D transitions between story slides and shareable cards
- **Mobile-First & Touch-Optimized** - Swipe gestures, safe area support, optimized performance
- **Composable Architecture** - Reusable `useStoryProgress` composable for custom implementations
- **Keyboard Navigation** - Arrow keys, spacebar pause/resume, ESC to exit
- **Pause on Interaction** - Auto-pause on touch/hover with smooth resume
- **Hardware Accelerated** - GPU-optimized GSAP animations for 60fps performance

## 📁 Project Structure

```
vue-wrapped/
├── src/
│   ├── components/
│   │   ├── StoryWrapper.vue          # Main orchestrator component
│   │   ├── StorySlide.vue            # Individual slide with animations
│   │   └── VerticalProgressBar.vue   # Instagram-style progress bar
│   ├── composables/
│   │   └── useStoryProgress.js       # Core story logic composable
│   ├── utils/
│   │   └── gsapHelpers.js            # GSAP animation utilities
│   └── examples/
│       └── SpotifyWrappedDemo.vue    # Complete implementation example
```

## 🚀 Quick Start

### Installation

```bash
npm install gsap
```

### Basic Usage

```vue
<template>
  <StoryWrapper
    :slides="storySlides"
    :slide-duration="5"
    @slide-change="handleSlideChange"
    @story-complete="handleComplete"
  >
    <!-- Define your slides -->
    <template #slide-0="{ isActive }">
      <div class="my-slide">
        <h1>Slide 1</h1>
      </div>
    </template>

    <template #slide-1="{ isActive }">
      <div class="my-slide">
        <h1>Slide 2</h1>
      </div>
    </template>
  </StoryWrapper>
</template>

<script setup>
import { ref } from 'vue';
import StoryWrapper from './components/StoryWrapper.vue';

const storySlides = ref([
  { id: 'slide-1', animationType: 'fade-slide' },
  { id: 'slide-2', animationType: 'scale-fade' }
]);

const handleSlideChange = ({ index, slide, direction }) => {
  console.log(`Changed to slide ${index}`);
};

const handleComplete = () => {
  console.log('Story completed!');
};
</script>
```

## 🎬 Story-to-Card Transition (Key Feature)

The system includes specialized logic for transitioning from story slides to a final shareable card:

```vue
<template>
  <StoryWrapper :slides="slides" @slide-change="handleSlideChange">
    <!-- Regular story slides -->
    <template #slide-0="{ isActive }">
      <div class="story-content">Story Content</div>
    </template>

    <!-- Final shareable card with special transition -->
    <template #slide-1="{ isActive }">
      <div class="shareable-card" ref="cardRef">
        <h2>My Wrapped</h2>
        <div class="stats">...</div>
        <button @click="share">Share</button>
      </div>
    </template>
  </StoryWrapper>
</template>

<script setup>
import { ref } from 'vue';
import { storyToCardTransition } from './utils/gsapHelpers';

const cardRef = ref(null);

const handleSlideChange = ({ index }) => {
  // Trigger special transition when reaching final card
  if (index === slides.length - 1) {
    triggerCardEntrance();
  }
};

const triggerCardEntrance = () => {
  const card = cardRef.value;
  
  // Custom 3D flip entrance with confetti
  gsap.timeline()
    .fromTo(card, 
      {
        opacity: 0,
        scale: 0.3,
        rotationY: -180,
        z: -500
      },
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        z: 0,
        duration: 1.2,
        ease: 'back.out(1.5)'
      }
    )
    .add(() => showConfetti());
};
</script>
```

## 🎨 Animation Types

The system includes 8 pre-built animation presets:

1. **fade-slide** - Fade with directional slide
2. **scale-fade** - Zoom in/out with fade
3. **rotate-fade** - 3D rotation with fade
4. **blur-zoom** - Cinematic blur with zoom
5. **flip** - 3D card flip effect
6. **elastic** - Playful elastic bounce
7. **split-reveal** - Reveal from center/edges
8. **morph** - Shape morphing transition

Specify per slide:

```javascript
const slides = [
  { id: 'welcome', animationType: 'scale-fade' },
  { id: 'stats', animationType: 'blur-zoom' },
  { id: 'card', animationType: 'morph' }
];
```

## 🎮 API Reference

### StoryWrapper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slides` | Array | required | Array of slide configurations |
| `slideDuration` | Number | 5 | Duration per slide (seconds) |
| `animationDuration` | Number | 0.6 | Transition duration (seconds) |
| `autoStart` | Boolean | true | Auto-start on mount |
| `loop` | Boolean | false | Loop back to start |
| `pauseOnHover` | Boolean | false | Pause on mouse hover |
| `allowProgressClick` | Boolean | true | Allow clicking progress bar |
| `disableNavigation` | Boolean | false | Disable nav overlays |
| `swipeThreshold` | Number | 50 | Swipe distance threshold (px) |
| `defaultAnimationType` | String | 'fade-slide' | Default animation type |

### StoryWrapper Events

| Event | Payload | Description |
|-------|---------|-------------|
| `slide-change` | `{ index, slide, direction }` | Fires when slide changes |
| `story-complete` | - | Fires when all slides complete |
| `story-start` | - | Fires when story starts |
| `pause` | - | Fires when paused |
| `resume` | - | Fires when resumed |

### useStoryProgress Composable

```javascript
import { useStoryProgress } from './composables/useStoryProgress';

const {
  currentSlide,      // ref: Current slide index
  progress,          // ref: Current progress (0-100)
  isPaused,          // ref: Pause state
  isTransitioning,   // ref: Transition state
  isFirstSlide,      // computed: Is first slide
  isLastSlide,       // computed: Is last slide
  startProgress,     // fn: Start/restart progress
  nextSlide,         // fn: Go to next slide
  previousSlide,     // fn: Go to previous slide
  goToSlide,         // fn: Jump to slide index
  pause,             // fn: Pause progress
  resume,            // fn: Resume progress
  togglePause,       // fn: Toggle pause/resume
  reset              // fn: Reset to first slide
} = useStoryProgress({
  totalSlides: 5,
  duration: 5,
  onSlideChange: (index, direction) => {},
  onComplete: () => {}
});
```

## 📱 Mobile Optimization

The system is optimized for mobile-first performance:

- **Touch Gestures**: Swipe left/right for navigation
- **Safe Area Support**: Automatic notch/home indicator spacing
- **Hardware Acceleration**: GPU-optimized transforms
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Touch Targets**: Enlarged tap areas for better UX
- **Viewport Units**: Uses `dvh` for consistent mobile height

## 🎯 Advanced: Custom Transitions

Create custom transition logic:

```javascript
import { gsap } from 'gsap';

// Custom story-to-card transition
const customTransition = (storyEl, cardEl) => {
  const tl = gsap.timeline();
  
  // Your custom animation logic
  tl.to(storyEl, { 
    opacity: 0, 
    scale: 0.8,
    duration: 0.5 
  })
  .fromTo(cardEl,
    { opacity: 0, y: 100 },
    { opacity: 1, y: 0, duration: 0.8 },
    '-=0.2'
  );
  
  return tl;
};
```

## 🔧 GSAP Helper Utilities

Import ready-to-use animation helpers:

```javascript
import { 
  storyToCardTransition,
  cardToStoryTransition,
  animateNumber,
  confettiBurst,
  floatingAnimation,
  staggerChildren
} from './utils/gsapHelpers';

// Animate number counter
animateNumber(element, 52847, { 
  duration: 2, 
  decimals: 0 
});

// Create confetti burst
confettiBurst(container, { 
  count: 50, 
  colors: ['#1DB954', '#FF6B6B'] 
});

// Add floating animation
floatingAnimation(element, { 
  distance: 10, 
  duration: 2 
});
```

## 🎨 Styling Guide

The components use scoped styles with CSS custom properties for easy theming:

```css
/* Override in your global styles */
.story-wrapper {
  --progress-bar-color: #1DB954;
  --progress-track-color: rgba(255, 255, 255, 0.3);
  --card-background: rgba(255, 255, 255, 0.95);
  --card-border-radius: 24px;
}
```

## 🧪 Example Implementation

See [SpotifyWrappedDemo.vue](src/examples/SpotifyWrappedDemo.vue) for a complete Spotify Wrapped-style implementation including:

- Welcome screen
- Stats slides (top artist, song, minutes)
- Genre breakdown
- Final shareable card with confetti
- Share and replay functionality

## 🚀 Performance Tips

1. **Limit Simultaneous Animations**: Use stagger for multiple elements
2. **Use `will-change` Sparingly**: Only on actively animating elements
3. **Optimize Images**: Use WebP, lazy loading
4. **Preload GSAP**: Call `initGSAP()` on app mount
5. **Cleanup**: Kill animations on component unmount

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! This is a production-ready template for building Spotify Wrapped-style experiences.

---

Built with ❤️ using Vue.js and GSAP
