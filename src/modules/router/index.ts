import { createRouter, createWebHashHistory } from '@ionic/vue-router';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';

const router = createRouter({
  // Hash URLs (/#/search) because GitHub Pages can't serve index.html for paths like /search.
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
