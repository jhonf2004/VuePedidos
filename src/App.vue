<template>
  <div id="app">
    <nav>
      <router-link to="/">Inicio</router-link> |
      <router-link to="/carta-comida">Carta Comida</router-link> |
      <router-link to="/carta-cocteles">Carta Cócteles</router-link> |
      <router-link to="/promos">Promos</router-link> |
      <router-link to="/reservas">Reservas</router-link> |
      <router-link to="/delivery">Delivery</router-link> |
      <router-link to="/encuesta">Encuesta</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
})
</script>

<style>
nav {
  padding: 1rem;
  background-color: #333;
}
nav a {
  color: white;
  margin-right: 1rem;
  text-decoration: none;
}
nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
