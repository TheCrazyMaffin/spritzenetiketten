<script setup lang="ts">
import { LabelDirectory } from '@/data/directory';
import LabelViewer from '@/components/LabelViewer.vue';
import LabelDetailModal from '@/components/LabelDetailModal.vue';
import { IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonRow, IonText, modalController, ModalOptions } from '@ionic/vue';
import { alertCircleOutline } from 'ionicons/icons';
import { computed, shallowRef, watch } from 'vue';
import { LabelDirectoryEntry } from '@/modules/data-schema/directory';

const props = defineProps<{
    queryString: string | undefined,
    tagSelection: { [key: string]: string | null }
}>()

const pageSize = 100

const displayedResults = shallowRef<typeof searchResults.value>([])

const searchResults = computed(() => LabelDirectory.labels.filter(label => {
  if(props.queryString){
    if(!label.name.toLowerCase().includes(props.queryString?.toLowerCase())) return false
  }
  for(const tagName in props.tagSelection){
    const tagValue = props.tagSelection[tagName] 
    if(tagValue !== null && label.tags[tagName] !== tagValue) return false
  }
  return true
}))

watch(searchResults, () => {
  displayedResults.value = searchResults.value.slice(0, pageSize)
})

const hasMoreResults = computed(() => displayedResults.value.length < searchResults.value.length)

function moreResults() {
  const startIndex = displayedResults.value.length
  displayedResults.value = [
    ...displayedResults.value,
    ...searchResults.value.slice(startIndex, startIndex + pageSize)
  ]
}

async function openLabel(label: LabelDirectoryEntry){
  const modalOptions: ModalOptions<typeof LabelDetailModal> = {
    component: LabelDetailModal,
    componentProps: { label }
  }
  const modal = await modalController.create(modalOptions)
  await modal.present()
}

moreResults()
</script>

<template>
  <IonText
    v-if="searchResults.length === 0"
    color="danger"
  >
    <p class="flex items-center justify-center gap-2 p-4">
      <IonIcon :icon="alertCircleOutline" />
      Keine Etiketten entsprechend der Suche gefunden
    </p>
  </IonText>
  <IonGrid v-else>
    <IonRow>
      <IonCol
        v-for="(label) in displayedResults"
        :key="label.name"
        size="12"
        size-sm="6"
        size-lg="3"
        size-xl="2"
      >
        <IonCard
          color="transparent"
          class="m-0"
          button
          @click="() => openLabel(label)"
        >
          <IonCardContent>
            <LabelViewer :composition="LabelDirectory.computeLabel(label)" />
          </IonCardContent>
        </IonCard>
      </IonCol>
    </IonRow>
    <IonCard
      v-if="hasMoreResults"
      color="light"
      button
      @click="moreResults"
    >
      <IonCardContent>
        <div class=" flex h-full items-center justify-center align-middle text-xl">
          <div>Mehr laden...</div>
        </div>
      </IonCardContent>
    </IonCard>
  </IonGrid>
</template>