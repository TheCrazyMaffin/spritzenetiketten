<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <ToolbarMenuButton />
        <IonTitle>Seite nicht gefunden</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 class="text-6xl font-bold text-yellow-500">
          404
        </h1>
        <p>Diese Seite existiert nicht.</p>
        <IonButton router-link="/">
          <IonIcon
            slot="start"
            :icon="homeOutline"
          />
          Zur Startseite
        </IonButton>
      </div>
    </IonContent>
    <DisclaimerFooter />
  </IonPage>
</template>

<script setup lang="ts">
import DisclaimerFooter from '@/components/DisclaimerFooter.vue';
import ToolbarMenuButton from '@/components/ToolbarMenuButton.vue';
import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { homeOutline } from 'ionicons/icons';
</script>
