<script setup lang="ts">
import ColorPickerButton from '@/components/editor/ColorPickerButton.vue';
import { LabelText } from '@/modules/data-schema/text';
import { defaultFontSize, defaultFontWeight } from '@/modules/draw/text';
import { Delta, deltaToLabelText, labelTextFormats, labelTextToDelta, Quill } from '@/modules/label-text-quill';
import { IonButton, IonIcon, IonSelect, IonSelectOption } from '@ionic/vue';
import { closeCircleOutline } from 'ionicons/icons';
import 'quill/dist/quill.core.css';
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

/**
 * Rich text editor for a label text (title or content) with toolbar inputs for the attributes the label renderer supports.
 */
defineProps<{ label: string }>()
const model = defineModel<LabelText>()

const sizes = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100]
const weights = [200, 300, 400, 500, 600, 700, 800, 900]

const editorElement = useTemplateRef("editor")
// Not reactive on purpose, Quill manages its own state.
let quill: Quill | undefined
// Range the toolbar applies to. Kept while the editor loses focus to toolbar inputs.
let lastRange: { index: number, length: number } | null = null
// Serialized model value last emitted by or loaded into the editor. Used to detect external changes.
let lastModelValue = ""

const formats = ref<Record<string, unknown>>({})

/** A single value of the current format or undefined if unset or mixed across the selection. */
function currentFormat(name: string) {
  const value = formats.value[name]
  return Array.isArray(value) ? undefined : value
}

const size = computed(() => (currentFormat("size") as number | undefined) ?? defaultFontSize)
const weight = computed(() => (currentFormat("weight") as number | undefined) ?? defaultFontWeight)
const verticalAlign = computed(() => (currentFormat("vertical-align") as string | undefined) ?? "baseline")
const color = computed(() => currentFormat("color") as string | undefined)

/** Presets plus the current value, so values from loaded labels show up as well. */
function withCurrent(presets: number[], current: number) {
  return [...new Set([...presets, current])].sort((a, b) => a - b)
}

function updateFormats() {
  if (!quill || !lastRange) return
  formats.value = quill.getFormat(lastRange.index, lastRange.length)
}

function applyFormat(name: string, value: unknown) {
  if (!quill) return
  if (lastRange && lastRange.length > 0) {
    // formatText() doesn't focus the editor, which would close the browser's color picker while it is open.
    quill.formatText(lastRange.index, lastRange.length, name, value, "user")
    updateFormats()
  } else {
    // Without a selection the format applies to the text typed next.
    quill.format(name, value, "user")
  }
}

function emitModel() {
  if (!quill) return
  const text = deltaToLabelText(quill.getContents())
  lastModelValue = JSON.stringify(text)
  model.value = text
}

function loadModel() {
  if (!quill) return
  lastModelValue = JSON.stringify(model.value)
  quill.setContents(labelTextToDelta(model.value), "silent")
}

onMounted(() => {
  if (!editorElement.value) return
  quill = new Quill(editorElement.value, {
    formats: labelTextFormats,
    modules: {
      clipboard: {
        // Paste as plain text. Formatting from other sources (e.g. a text color) would silently change how the label renders.
        matchers: [[Node.ELEMENT_NODE, (_node: Node, delta: Delta) => new Delta(delta.ops.map(op => ({ insert: op.insert })))]],
      },
    },
  })
  loadModel()
  quill.on("selection-change", range => {
    if (!range) return
    lastRange = range
    updateFormats()
  })
  quill.on("text-change", (_delta, _oldContents, source) => {
    if (source === "user") emitModel()
    const range = quill?.getSelection()
    if (range) lastRange = range
    updateFormats()
  })
})

watch(model, value => {
  if (JSON.stringify(value) !== lastModelValue) loadModel()
})

onBeforeUnmount(() => {
  quill = undefined
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row flex-wrap items-center gap-2">
      <span class="w-full text-sm font-medium">{{ label }}</span>
      <IonSelect
        label="Größe"
        label-placement="stacked"
        interface="popover"
        fill="outline"
        class="toolbar-select"
        :value="size"
        :selected-text="String(size)"
        @ion-change="applyFormat('size', $event.detail.value === defaultFontSize ? false : $event.detail.value)"
      >
        <IonSelectOption
          v-for="option in withCurrent(sizes, size)"
          :key="option"
          :value="option"
        >
          {{ option === defaultFontSize ? `${option} (Standard)` : option }}
        </IonSelectOption>
      </IonSelect>
      <IonSelect
        label="Stärke"
        label-placement="stacked"
        interface="popover"
        fill="outline"
        class="toolbar-select"
        :value="weight"
        :selected-text="String(weight)"
        @ion-change="applyFormat('weight', $event.detail.value === defaultFontWeight ? false : $event.detail.value)"
      >
        <IonSelectOption
          v-for="option in withCurrent(weights, weight)"
          :key="option"
          :value="option"
        >
          {{ option === defaultFontWeight ? `${option} (Standard)` : option }}
        </IonSelectOption>
      </IonSelect>
      <IonSelect
        label="Ausrichtung"
        label-placement="stacked"
        interface="popover"
        fill="outline"
        class="toolbar-select"
        :value="verticalAlign"
        @ion-change="applyFormat('vertical-align', $event.detail.value === 'baseline' ? false : $event.detail.value)"
      >
        <IonSelectOption value="baseline">
          Grundlinie
        </IonSelectOption>
        <IonSelectOption value="top">
          Oben
        </IonSelectOption>
        <IonSelectOption value="bottom">
          Unten
        </IonSelectOption>
      </IonSelect>
      <div class="flex flex-row items-center">
        <span class="text-sm">Farbe</span>
        <ColorPickerButton
          :color="color"
          @pick="applyFormat('color', $event)"
        />
        <IonButton
          v-if="color"
          fill="clear"
          size="small"
          aria-label="Farbe entfernen"
          title="Farbe entfernen (Text erhält die Text-Hintergrundfüllung)"
          @click="applyFormat('color', false)"
        >
          <IonIcon
            slot="icon-only"
            :icon="closeCircleOutline"
          />
        </IonButton>
      </div>
    </div>
    <div
      ref="editor"
      class="label-text-editor"
    />
    <div class="text-sm text-neutral-700 dark:text-neutral-300 pl-2">
      Nutzung wie im Textverarbeitungsprogramm: Text auswählen, Formatierung ändern. / Formatierung ändern, Text schreiben.
    </div>
  </div>
</template>

<style scoped>
.toolbar-select {
  width: 9rem;
}

.label-text-editor {
  border: 1px solid var(--ion-color-medium);
  border-radius: 4px;
}

.label-text-editor :deep(.ql-editor) {
  min-height: 4rem;
  font-family: "Roboto Condensed Variable", sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
}

/* Transparent text keeps its space on the label. Outline it, otherwise it can't be seen in the editor. */
.label-text-editor :deep(.ql-editor [style*="color: transparent"]) {
  outline: 1px dashed var(--ion-color-medium);
}
</style>
