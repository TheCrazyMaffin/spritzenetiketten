<script setup lang="ts">
import ColorInput from '@/components/editor/ColorInput.vue';
import { LabelFillStyle } from '@/modules/data-schema/style';
import { IonContent, IonItem, IonLabel, IonList, IonNote, IonPopover } from '@ionic/vue';
import { computed, useId } from 'vue';

/**
 * Item that opens a popover with a color input for every fill property.
 * Unset colors are removed from the fill, a fill without any color results in undefined.
 */
withDefaults(defineProps<{ label: string, emptyText?: string }>(), { emptyText: "Keine" })
const model = defineModel<LabelFillStyle | undefined>()

const fillProperties: { key: keyof LabelFillStyle, name: string }[] = [
  { key: "solid", name: "Vollständig" },
  { key: "topHalf", name: "Obere Hälfte" },
  { key: "bottomHalf", name: "Untere Hälfte" },
  { key: "topRightHalf", name: "Diagonal oben rechts" },
  { key: "bottomLeftHalf", name: "Diagonal unten links" },
  { key: "hatch135deg", name: "Schraffur" },
]

const triggerId = useId()

const setColors = computed(() => fillProperties.filter(property => model.value?.[property.key]))

function setColor(key: keyof LabelFillStyle, color: string | null | undefined) {
  const fill = { ...model.value }
  if (color) {
    fill[key] = color
  } else {
    delete fill[key]
  }
  model.value = Object.keys(fill).length > 0 ? fill : undefined
}
</script>

<template>
  <IonItem
    :id="triggerId"
    :button="true"
    :detail="false"
  >
    <IonLabel>{{ label }}</IonLabel>
    <div
      slot="end"
      class="flex flex-row gap-1"
    >
      <span
        v-for="property in setColors"
        :key="property.key"
        class="swatch"
        :title="property.name"
        :style="{ background: model?.[property.key] ?? undefined }"
      />
      <IonNote v-if="setColors.length === 0">
        {{ emptyText }}
      </IonNote>
    </div>
  </IonItem>
  <IonPopover
    :trigger="triggerId"
    class="fill-popover"
  >
    <IonContent>
      <IonList lines="full">
        <IonItem
          v-for="property in fillProperties"
          :key="property.key"
        >
          <ColorInput
            :model-value="model?.[property.key]"
            :label="property.name"
            label-placement="stacked"
            @update:model-value="setColor(property.key, $event)"
          />
        </IonItem>
      </IonList>
    </IonContent>
  </IonPopover>
</template>

<style scoped>
.swatch {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 4px;
  border: 1px solid var(--ion-color-medium);
}

.fill-popover {
  --width: min(24rem, 90vw);
}
</style>
