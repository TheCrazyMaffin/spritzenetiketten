<script setup lang="ts">
import { colorToHex } from '@/modules/util';
import { IonButton } from '@ionic/vue';
import { onBeforeUnmount, useTemplateRef } from 'vue';

/**
 * Button showing a color swatch that opens the browser's own color picker.
 */
defineProps<{ color: string | null | undefined }>()
const emit = defineEmits<{ pick: [color: string] }>()

const picker = useTemplateRef("picker")

// The picker fires input events continuously while dragging. Each pick re-renders the label, so they are debounced.
const pickDelay = 150
let pendingColor: string | undefined
let pickTimeout: ReturnType<typeof setTimeout> | undefined

function schedulePick(color: string) {
  pendingColor = color
  clearTimeout(pickTimeout)
  pickTimeout = setTimeout(flushPick, pickDelay)
}

function flushPick() {
  clearTimeout(pickTimeout)
  if (pendingColor !== undefined) emit('pick', pendingColor)
  pendingColor = undefined
}

// E.g. a popover containing the button closes before the delay is over.
onBeforeUnmount(flushPick)

function openPicker() {
  if (!picker.value) return
  try {
    picker.value.showPicker()
  } catch {
    // showPicker() is unsupported in older browsers.
    picker.value.click()
  }
}
</script>

<template>
  <span class="relative inline-flex">
    <IonButton
      fill="clear"
      size="small"
      aria-label="Farbe wählen"
      @click="openPicker"
    >
      <span
        slot="icon-only"
        class="swatch"
        :style="{ background: color ?? undefined }"
      />
    </IonButton>
    <input
      ref="picker"
      type="color"
      tabindex="-1"
      aria-hidden="true"
      class="pointer-events-none absolute bottom-0 left-0 h-0 w-0 opacity-0"
      :value="colorToHex(color)"
      @input="schedulePick(($event.target as HTMLInputElement).value)"
      @change="flushPick"
    >
  </span>
</template>

<style scoped>
.swatch {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 4px;
  border: 1px solid var(--ion-color-medium);
  /* Checkerboard, visible for unset or transparent colors. */
  background-image: repeating-conic-gradient(var(--ion-color-light) 0 25%, transparent 0 50%);
  background-size: 8px 8px;
}
</style>
