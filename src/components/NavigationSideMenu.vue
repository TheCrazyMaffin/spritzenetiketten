<script setup lang="ts">
import { IonContent, IonItem, IonList, IonMenu } from '@ionic/vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const routes = router.getRoutes().filter(route => route.meta.navigationEntry)

</script>

<template>
  <IonMenu content-id="content">
    <IonContent>
      <IonList lines="full">
        <IonItem
          v-for="(route, index) in routes"
          :key="index"
          :router-link="route.path"
        >
          {{ route.meta.navigationName ?? route.name }}
        </IonItem>
      </IonList>
    </IonContent>
  </IonMenu>
</template>