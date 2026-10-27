<script setup lang="ts">
import { LabelComposition } from '@/modules/data-schema/directory';
import { LabelTemplate } from '@/modules/draw/label-template';
import { computed, onMounted, useTemplateRef, watch } from 'vue';

const props = defineProps<{ composition: LabelComposition, resolution?: number }>()

const canvas = useTemplateRef<HTMLCanvasElement>("canvas")
// Known before drawing, so the canvas takes its final size right away instead of growing once the label is drawn.
const size = computed(() => LabelTemplate.canvasSize(
  props.composition.aspectRatio ?? LabelTemplate.defaults.aspectRatio,
  props.resolution ?? 500,
))

function render() {
  const context = canvas.value?.getContext("bitmaprenderer")
  if (!context) return
  try {
    // Hands the drawn pixels over to the visible canvas without encoding and decoding an image.
    const bitmap = new LabelTemplate(props.composition).toCanvas(size.value.width).transferToImageBitmap()
    context.transferFromImageBitmap(bitmap)
  } catch (error) {
    // Keep showing the last successful render, e.g. while the user is in the middle of entering a value.
    console.error("[LabelViewer] Rendering failed", error)
  }
}

onMounted(render)
// Comparing the serialized composition re-renders on any deep change but not when the parent
// passes a new but identical object (e.g. LabelDirectory.computeLabel() in a template).
// Post flush: a changed size is applied to the canvas first, which clears it, then the label is drawn.
watch(() => [JSON.stringify(props.composition), props.resolution], render, { flush: "post" })
</script>

<template>
  <canvas
    ref="canvas"
    :width="size.width"
    :height="size.height"
    class="label-viewer"
  />
</template>

<style scoped>
.label-viewer {
  max-width: 100%;
  height: auto;
}
</style>
