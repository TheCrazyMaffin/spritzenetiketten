<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <ToolbarMenuButton />
        <IonSearchbar
          v-model="queryString"
          :debounce="250"
          placeholder="Suchen"
        />
      </IonToolbar>
      <IonToolbar>
        <div class="flex flex-row py-2 overflow-x-scroll">
          <IonSelect
            v-for="tag in LabelDirectory.tags"
            :key="`select-${tag[0]}`"
            v-model="tagSelection[tag[0]]"
            interface="modal"
            fill="outline"
            class="px-2"
            :placeholder="tag[0]"
          >
            <IonSelectOption
              :value="null"
              class="italic"
            >
              {{ tag[0] }}
            </IonSelectOption>
            <IonSelectOption
              v-for="value in tag[1]"
              :key="`select-${tag[0]}-value-${value}`"
              :value="value"
            >
              {{ value }}
            </IonSelectOption>
          </IonSelect>
        </div>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <SearchResults
        :query-string="queryString"
        :tag-selection="tagSelection"
      />
    </IonContent>
    <DisclaimerFooter />
  </IonPage>
</template>

<script setup lang="ts">
import DisclaimerFooter from "@/components/DisclaimerFooter.vue";
import SearchResults from "@/components/SearchResults.vue";
import ToolbarMenuButton from "@/components/ToolbarMenuButton.vue";
import { LabelDirectory } from "@/data/directory";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { ref } from "vue";

const tagSelection = ref<{ [key: string]: string | null }>(
  Object.fromEntries(Array.from(LabelDirectory.tags.keys(), (l) => [l, null])),
);
const queryString = ref<string | undefined>()

definePage({ meta: { navigationEntry: true, navigationName: "Suche" } });
</script>
