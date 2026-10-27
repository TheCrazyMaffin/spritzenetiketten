<script setup lang="ts">
import { defaultFontSize, defaultFontWeight, fontFamily } from '@/modules/draw/text';

// Canvas text doesn't wait for web fonts, it silently draws with a fallback. Load the label font before any label renders.
await document.fonts.load(`${defaultFontWeight} ${defaultFontSize}px "${fontFamily}"`).catch(error => {
  console.warn("[AppInitializer] Loading the label font failed, labels use a fallback font.", error)
})
</script>

<template>
  <slot />
</template>
