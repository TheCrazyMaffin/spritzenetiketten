<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <ToolbarMenuButton />
        <IonTitle>Editor</IonTitle>
        <IonButtons slot="end">
          <LabelDownloadButton
            v-if="composition"
            :composition="composition"
            :file-name="downloadFileName"
          />
          <IonButton
            :disabled="!composition"
            @click="newComposition"
          >
            <IonIcon
              slot="start"
              :icon="addOutline"
            />
            Neu
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <div class="preview flex justify-center p-4">
        <LabelViewer
          v-if="composition"
          :composition="composition"
          :resolution="1000"
          class="max-h-[30vh] max-w-full"
        />
      </div>
    </IonHeader>
    <IonContent>
      <IonAccordionGroup
        v-if="composition"
        :multiple="true"
        :value="['layout']"
      >
        <IonAccordion value="layout">
          <IonItem slot="header">
            <IonLabel>Layout</IonLabel>
          </IonItem>
          <IonList slot="content">
            <IonItem>
              <NumberInput
                v-model="composition.aspectRatio"
                label="Seitenverhältnis"
                :placeholder="String(LabelTemplate.defaults.aspectRatio)"
                :min="0.1"
              />
              <IonButton
                slot="end"
                fill="clear"
                class="normal-case"
                @click="enterDimensions"
              >
                <IonIcon
                  slot="start"
                  :icon="resizeOutline"
                />
                Von Höhe x Breite
              </IonButton>
            </IonItem>
            <IonItem>
              <NumberInput
                v-model="composition.roundedEdges"
                label="Abgerundete Ecken"
                :placeholder="String(LabelTemplate.defaults.roundedEdges)"
                :min="0"
              />
            </IonItem>
          </IonList>
        </IonAccordion>
        <IonAccordion value="border">
          <IonItem slot="header">
            <IonLabel>Ränder</IonLabel>
          </IonItem>
          <IonList slot="content">
            <FillInput
              v-model="composition.borderFill"
              label="Randfüllung"
            />
            <IonItem>
              <IonSelect
                label="Seiten"
                interface="popover"
                placeholder="Keine"
                :multiple="true"
                :value="selectedBorderSides"
                @ion-change="setBorderSides($event.detail.value)"
              >
                <IonSelectOption
                  v-for="(name, side) in sideNames"
                  :key="side"
                  :value="side"
                >
                  {{ name }}
                </IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <NumberInput
                v-model="composition.borderSize"
                label="Randstärke"
                :placeholder="String(LabelTemplate.defaults.borderSize)"
                :min="0"
              />
            </IonItem>
            <IonItem>
              <ColorInput
                v-model="composition.midline"
                label="Mittellinie"
              />
            </IonItem>
          </IonList>
        </IonAccordion>
        <IonAccordion value="background">
          <IonItem slot="header">
            <IonLabel>Hintergrund</IonLabel>
          </IonItem>
          <IonList slot="content">
            <FillInput
              v-model="composition.backgroundFill"
              label="Hintergrundfüllung"
            />
            <FillInput
              v-model="composition.textBackgroundFill"
              label="Textfüllung"
              empty-text="Standard (Schwarz)"
            />
          </IonList>
        </IonAccordion>
        <IonAccordion value="content">
          <IonItem slot="header">
            <IonLabel>Inhalt</IonLabel>
          </IonItem>
          <div slot="content">
            <IonList>
              <IonItem>
                <IonSelect
                  v-model="composition.layout"
                  label="Typ"
                  interface="popover"
                  :placeholder="`${layoutNames[LabelTemplate.defaults.layout]} (Standard)`"
                >
                  <IonSelectOption
                    v-for="(name, layout) in layoutNames"
                    :key="layout"
                    :value="layout"
                  >
                    {{ name }}
                  </IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonList>
            <div class="flex flex-col gap-6 p-4">
              <LabelTextEditor
                v-model="titleText"
                label="Titel"
              />
              <LabelTextEditor
                v-model="contentText"
                label="Inhalt"
              />
            </div>
          </div>
        </IonAccordion>
      </IonAccordionGroup>
      <div
        v-else
        class="flex h-full items-center justify-center"
      >
        <IonSpinner />
      </div>
    </IonContent>
    <DisclaimerFooter />
  </IonPage>
</template>

<script setup lang="ts">
import DisclaimerFooter from '@/components/DisclaimerFooter.vue';
import ColorInput from '@/components/editor/ColorInput.vue';
import FillInput from '@/components/editor/FillInput.vue';
import LabelTextEditor from '@/components/editor/LabelTextEditor.vue';
import NumberInput from '@/components/editor/NumberInput.vue';
import LabelDownloadButton from '@/components/LabelDownloadButton.vue';
import LabelViewer from '@/components/LabelViewer.vue';
import ToolbarMenuButton from '@/components/ToolbarMenuButton.vue';
import { LabelLayout } from '@/modules/data-schema/content';
import { LabelComposition } from '@/modules/data-schema/directory';
import { LabelSides } from '@/modules/data-schema/style';
import { LabelText } from '@/modules/data-schema/text';
import { LabelTemplate } from '@/modules/draw/label-template';
import { loadEditorComposition, parseComposition, saveEditorComposition } from '@/modules/editor-storage';
import { parseNumber } from '@/modules/util';
import { alertController, IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonSpinner, IonTitle, IonToolbar, toastController } from '@ionic/vue';
import { addOutline, resizeOutline } from 'ionicons/icons';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

definePage({meta: {navigationEntry: true, navigationName: 'Editor'}})

const layoutNames: Record<LabelLayout, string> = {
  "small": "Klein",
  "large": "Groß",
  "add-on": "Add-On",
  "line": "Leitungsetikett",
}

const sideNames: Record<keyof LabelSides, string> = {
  top: "Oben",
  right: "Rechts",
  bottom: "Unten",
  left: "Links",
}

/** Undefined until the stored composition is loaded. */
const composition = ref<LabelComposition>()

// Persistence
// -----------------------------------------------------------------------------

const saveDelay = 500
let saveTimeout: ReturnType<typeof setTimeout> | undefined

function save() {
  clearTimeout(saveTimeout)
  saveTimeout = undefined
  if (composition.value) saveEditorComposition(composition.value)
}

watch(composition, () => {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(save, saveDelay)
}, { deep: true })

onBeforeUnmount(() => {
  if (saveTimeout !== undefined) save()
})

// Loading labels from outside the editor (e.g. the label detail modal) via the "load" query parameter
// -----------------------------------------------------------------------------

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  composition.value = loadEditorComposition() ?? {}
  await loadFromRoute(route.query.load)
})

watch(() => route.query.load, (load) => {
  // Before the stored composition is loaded the parameter is handled by onMounted.
  if (composition.value) void loadFromRoute(load)
})

async function loadFromRoute(load: unknown) {
  if (typeof load !== "string") return
  // Remove the parameter so reloading the page or navigating back doesn't load the label again.
  const query = { ...route.query }
  delete query.load
  await router.replace({ query })

  const loaded = parseComposition(load)
  if (!loaded) {
    const toast = await toastController.create({ message: "Das Etikett konnte nicht geladen werden.", duration: 3000, color: "danger" })
    await toast.present()
    return
  }
  const confirmed = await confirmReplace(loaded, {
    header: "Etikett überschreiben?",
    message: "Das Etikett, das gerade bearbeitet wird, wird durch das geladene Etikett ersetzt.",
    confirmText: "Überschreiben",
  })
  if (confirmed) composition.value = loaded
}

async function newComposition() {
  const confirmed = await confirmReplace({}, {
    header: "Neues Etikett?",
    message: "Das Etikett, das gerade bearbeitet wird, wird verworfen.",
    confirmText: "Verwerfen",
  })
  if (confirmed) composition.value = {}
}

/**
 * Asks before replacing the composition currently being edited. Doesn't ask if there is nothing to lose.
 */
async function confirmReplace(replacement: LabelComposition, texts: { header: string, message: string, confirmText: string }) {
  const current = JSON.stringify(composition.value)
  if (current === "{}" || current === JSON.stringify(replacement)) return true
  const alert = await alertController.create({
    header: texts.header,
    message: texts.message,
    buttons: [
      { text: "Abbrechen", role: "cancel" },
      { text: texts.confirmText, role: "confirm" },
    ],
  })
  await alert.present()
  const { role } = await alert.onDidDismiss()
  return role === "confirm"
}

// Inputs
// -----------------------------------------------------------------------------

async function enterDimensions() {
  const alert = await alertController.create({
    header: "Seitenverhältnis berechnen",
    message: "Die Einheit ist egal, solange beide Maße dieselbe haben.",
    inputs: [
      { name: "width", type: "number", placeholder: "Breite", min: 0 },
      { name: "height", type: "number", placeholder: "Höhe", min: 0 },
    ],
    buttons: [
      { text: "Abbrechen", role: "cancel" },
      {
        text: "Übernehmen",
        handler: (data: { width: string, height: string }) => {
          const width = parseNumber(data.width)
          const height = parseNumber(data.height)
          // Returning false keeps the alert open.
          if (!width || !height || width <= 0 || height <= 0 || !composition.value) return false
          composition.value.aspectRatio = Math.round(width / height * 1000) / 1000
        },
      },
    ],
  })
  await alert.present()
}

const selectedBorderSides = computed(() =>
  (Object.keys(sideNames) as (keyof LabelSides)[]).filter(side => composition.value?.borderSides?.[side]),
)

function setBorderSides(sides: (keyof LabelSides)[]) {
  if (!composition.value) return
  composition.value.borderSides = {
    top: sides.includes("top"),
    right: sides.includes("right"),
    bottom: sides.includes("bottom"),
    left: sides.includes("left"),
  }
}

function textModel(section: "title" | "content") {
  return computed({
    get: () => composition.value?.text?.[section],
    set: (text: LabelText) => {
      if (!composition.value) return
      composition.value.text = { ...composition.value.text, [section]: text }
    },
  })
}

const titleText = textModel("title")
const contentText = textModel("content")

// Download
// -----------------------------------------------------------------------------

/** Plain title text, line breaks become spaces. */
const downloadFileName = computed(() =>
  (composition.value?.text?.title ?? []).map(part => part.insert).join("").replace(/\s+/g, " ").trim() || "Etikett",
)
</script>

<style scoped>
.preview {
  background: var(--ion-color-light);
}
</style>
