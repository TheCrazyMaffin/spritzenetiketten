<script setup lang="ts">
import LabelDownloadButton from '@/components/LabelDownloadButton.vue';
import LabelViewer from '@/components/LabelViewer.vue';
import { LabelDirectory } from '@/data/directory';
import { LabelDirectoryEntry } from '@/modules/data-schema/directory';
import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonTitle, IonToolbar, modalController } from '@ionic/vue';
import { close, createOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';

const props = defineProps<{ label: LabelDirectoryEntry }>()

const composition = LabelDirectory.computeLabel(props.label)

const router = useRouter()

async function openInEditor() {
  // The modal isn't part of the page, it would stay open on top of the editor.
  await modalController.dismiss()
  await router.push({ path: "/editor", query: { load: JSON.stringify(composition) } })
}
</script>

<template>
  <IonHeader>
    <IonToolbar>
      <IonTitle>{{ label.name }}</IonTitle>
      <IonButtons slot="end">
        <IonButton
          aria-label="Schließen"
          @click="modalController.dismiss()"
        >
          <IonIcon
            slot="icon-only"
            :icon="close"
          />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  </IonHeader>
  <IonContent>
    <div class="p-4">
      <LabelViewer
        :composition="composition"
        :resolution="1000"
      />
    </div>
    <IonList>
      <IonListHeader v-if="label.description">
        <IonLabel>{{ label.description }}</IonLabel>
      </IonListHeader>
      <IonItem
        v-for="(value, name) in label.tags"
        :key="name"
      >
        <IonLabel>
          <h3>
            {{ name }}
          </h3>
          <p>{{ value }}</p>
        </IonLabel>
      </IonItem>
    </IonList>
  </IonContent>
  <IonFooter>
    <IonToolbar>
      <div class="flex flex-row flex-wrap justify-end gap-2 px-2">
        <IonButton
          fill="outline"
          @click="openInEditor"
        >
          <IonIcon
            slot="start"
            :icon="createOutline"
          />
          Bearbeiten
        </IonButton>
        <LabelDownloadButton
          :composition="composition"
          :file-name="label.name"
        />
      </div>
    </IonToolbar>
  </IonFooter>
</template>
