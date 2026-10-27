<template>
  <IonApp>
    <NavigationSideMenu />
    <IonPage id="content">
      <Suspense>
        <AppInitializer>
          <RouterView />
        </AppInitializer>

        <template #fallback>
          <div class="flex h-full flex-col items-center justify-center gap-4">
            <IonSpinner />
            <span>Lädt...</span>
          </div>
        </template>
      </Suspense>
    </IonPage>
  </IonApp>
</template>

<script setup lang="ts">
import AppInitializer from '@/components/AppInitializer.vue';
import NavigationSideMenu from '@/components/NavigationSideMenu.vue';
import { IonApp, IonPage, IonSpinner } from '@ionic/vue';
</script>
