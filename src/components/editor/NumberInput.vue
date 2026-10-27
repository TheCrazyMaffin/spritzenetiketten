<script setup lang="ts">
import { parseNumber } from '@/modules/util';
import { IonInput } from '@ionic/vue';
import { ref, watch } from 'vue';

/**
 * IonInput for numbers. Keeps the typed text locally so intermediate input like "2." or "2.50" isn't reformatted while typing.
 * Empty input and values below `min` result in undefined.
 */
const props = defineProps<{ min?: number }>()
const model = defineModel<number | undefined>()

const text = ref(model.value?.toString() ?? "")

watch(model, value => {
  if (value !== toModelValue(text.value)) text.value = value?.toString() ?? ""
})

function toModelValue(value: string) {
  const number = parseNumber(value)
  if (number === undefined || (props.min !== undefined && number < props.min)) return undefined
  return number
}

function onInput(value: string | null | undefined) {
  text.value = value ?? ""
  model.value = toModelValue(text.value)
}
</script>

<template>
  <IonInput
    type="number"
    inputmode="decimal"
    :value="text"
    :min="min"
    @ion-input="onInput($event.detail.value)"
  />
</template>
