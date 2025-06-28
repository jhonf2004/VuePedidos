<template>
  <div id="app">
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
