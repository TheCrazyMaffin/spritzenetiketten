<script setup lang="ts">
import ColorPickerButton from '@/components/editor/ColorPickerButton.vue';
import { IonInput } from '@ionic/vue';

/**
 * Text input for any CSS color with a button to pick a color using the browser's color picker.
 * Empty input results in undefined.
 */
const model = defineModel<string | null | undefined>()
</script>

<template>
  <IonInput
    :value="model ?? ''"
    placeholder="z. B. #ff0000, rgb(255, 0, 0), red"
    :clear-input="true"
    @ion-input="model = $event.detail.value || undefined"
  >
    <ColorPickerButton
      slot="end"
      :color="model"
      @pick="model = $event"
    />
  </IonInput>
</template>
