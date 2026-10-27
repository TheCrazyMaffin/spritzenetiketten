<script setup lang="ts">
import { LabelComposition } from '@/modules/data-schema/directory';
import { LabelTemplate } from '@/modules/draw/label-template';
import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonPopover, toastController } from '@ionic/vue';
import { downloadOutline } from 'ionicons/icons';
import { useId } from 'vue';

/**
 * Button that opens a popover to download the label as PNG in one of several widths.
 */
const props = defineProps<{ composition: LabelComposition, fileName: string }>()

/** Image widths in pixels offered for download. */
const downloadWidths = [500, 1000, 2000, 4000]

const triggerId = useId()

function downloadHeight(width: number) {
  return LabelTemplate.canvasSize(props.composition.aspectRatio ?? LabelTemplate.defaults.aspectRatio, width).height
}

async function downloadLabel(width: number) {
  let blob: Blob
  try {
    blob = await new LabelTemplate(props.composition).toCanvas(width).convertToBlob({ type: "image/png" })
  } catch (error) {
    // E.g. the editor while the user is in the middle of entering a value.
    console.error("[LabelDownloadButton] Rendering failed", error)
    const toast = await toastController.create({ message: "Das Etikett konnte nicht heruntergeladen werden.", duration: 3000, color: "danger" })
    await toast.present()
    return
  }
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  // Label names may contain characters that are not allowed in file names (e.g. "mg/ml").
  anchor.download = `${props.fileName.replace(/[\\/:*?"<>|]/g, "_")}_${width}px.png`
  anchor.click()
  // Revoking right after click() can cancel the download in Firefox and Safari, which start it asynchronously.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
</script>

<template>
  <IonButton :id="triggerId">
    <IonIcon
      slot="start"
      :icon="downloadOutline"
    />
    Herunterladen
  </IonButton>
  <IonPopover
    :trigger="triggerId"
    :dismiss-on-select="true"
  >
    <IonContent>
      <IonList lines="none">
        <IonItem
          v-for="width in downloadWidths"
          :key="width"
          :button="true"
          :detail="false"
          @click="downloadLabel(width)"
        >
          <IonLabel>{{ width }} × {{ downloadHeight(width) }} px</IonLabel>
        </IonItem>
      </IonList>
    </IonContent>
  </IonPopover>
</template>
