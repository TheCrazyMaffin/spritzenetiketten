<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <ToolbarMenuButton />
        <IonTitle>Spritzenetiketten</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="flex flex-col items-center">
        <h1 class="text-center text-yellow-500 underline dark:decoration-white decoration-black decoration-2">
          Spritzenetiketten
        </h1>
        <IonCard
          button
          router-link="/search"
        >
          <IonCardHeader class="text-center">
            <IonCardTitle>
              Suche
            </IonCardTitle>
            <IonCardSubtitle>
              Datenbank mit {{ LabelDirectory.labels.length }} vorgefertigten Etiketten durchsuchen
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
        <IonCard
          button
          router-link="/editor"
        >
          <IonCardHeader class="text-center">
            <IonCardTitle>
              Editor
            </IonCardTitle>
            <IonCardSubtitle>
              Komplett individuelles Etikett erstellen
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
        <h2 class="pt-10 underline decoration-yellow-500 decoration-2">
          Über diese Webseite
        </h2>
        <div class="max-w-xl text-justify px-5">
          Spritzenetiketten sind Aufkleber zur Kennzeichnung von Spritzen mit Medikamenten. Zum Aussehen (Farben, Muster, Text) der Etiketten gibt es eine <a href="https://www.divi.de/service/spritzenetiketten">Empfehlung der DIVI</a>, sowie die <a href="https://www.iso.org/standard/76678.html">ISO 26825</a>.<br>
          Fertige Etiketten können als Print-Produkte bei diversen Firmen erworben werden, aber Etiketten selbst erstellen, drucken oder digital verwenden ist erstaunlich unzugänglich. Nachdem man mehrere komplexe Dokumente mit Vorgaben hoch- und runter-gelesen hat, folgt nun, dass man einen Grafikeditor bemühen muss um diese umzusetzen. Dieser Aufwand ist eine große Hürde für etwas, das der Standard für Medikamentensicherheit sein sollte.<br><br>
          Diese Webseite soll diese Hürde nehmen und für das Thema Medikamentensicherheit sensibilisieren.<br>
          Angelehnt an die Empfehlung der DIVI finden sich über die <RouterLink to="/search">Suche</RouterLink> Etiketten aus der Beschriftungsempfehlung. Zusätzlich kann jedes Etikett individuell bearbeitet werden oder gleich von Grund auf neu entworfen werden.<br>
          Diese Funktion soll natürlich nicht dazu dienen, dass nun neue und uneinheitliche Etiketten entstehen, sondern eher um die Möglichkeiten im Rahmen der Empfehlung vollständig zu nutzen. Ein Etikett muss nicht genau "so breit" und "so hoch" sein und nur weil es kein Etikett mit "genau dieser Dosis" gibt, ist das keine Sackgasse - der <RouterLink to="/editor">Editor</RouterLink> soll die Möglichkeit bieten Etiketten auf die eigenen Ansprüche anzupassen. (Jedes Etikett aus der Suche kann im Editor geladen werden. Nicht für jedes Etikett muss man bei Null starten.)
        </div>
        <div class="pt-5">
          <IonButton
            fill="outline"
            href="https://github.com/TheCrazyMaffin/spritzenetiketten/"
            target="_blank"
          >
            <IonIcon
              slot="start"
              :icon="logoGithub"
            />
            GitHub
          </IonButton>
        </div>
      </div>
    </IonContent>
    <DisclaimerFooter />
  </IonPage>
</template>

<script setup lang="ts">
import DisclaimerFooter from '@/components/DisclaimerFooter.vue';
import ToolbarMenuButton from '@/components/ToolbarMenuButton.vue';
import { LabelDirectory } from '@/data/directory';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonIcon, IonButton } from '@ionic/vue';
import { logoGithub } from 'ionicons/icons';

definePage({meta: {navigationEntry: true, navigationName: 'Startseite'}})

</script>