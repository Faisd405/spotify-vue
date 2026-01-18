<template>
  <div id="app">
    <!-- Switch between demos -->
    <EmoriaBirthdayDemo />
    <!-- <SpotifyWrappedDemo /> -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EmoriaBirthdayDemo from './examples/EmoriaBirthdayDemo.vue';
import SpotifyWrappedDemo from './examples/SpotifyWrappedDemo.vue';

// Switch demo: 'birthday' or 'spotify'
const currentDemo = ref('birthday');
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #000;
  color: #fff;
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Remove tap highlight on mobile */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* Smooth font rendering */
body {
  text-rendering: optimizeLegibility;
  font-feature-settings: 'kern' 1;
  font-kerning: normal;
}
</style>
