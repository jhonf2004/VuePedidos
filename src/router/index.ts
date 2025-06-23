import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CartaComida from '../views/CartaComida.vue'
import CartaCocteles from '../views/CartaCocteles.vue'
import Promos from '../views/Promos.vue'
import Reservas from '../views/Reservas.vue'
import Delivery from '../views/Delivery.vue'
import Encuesta from '../views/Encuesta.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/carta-comida', name: 'CartaComida', component: CartaComida },
  { path: '/carta-cocteles', name: 'CartaCocteles', component: CartaCocteles },
  { path: '/promos', name: 'Promos', component: Promos },
  { path: '/reservas', name: 'Reservas', component: Reservas },
  { path: '/delivery', name: 'Delivery', component: Delivery },
  { path: '/encuesta', name: 'Encuesta', component: Encuesta },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
