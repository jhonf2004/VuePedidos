<template>
  <div
    class="w-screen h-screen bg-cover bg-center flex items-center justify-center"
    :style="{ backgroundImage: `url(${fondo})` }"
  >
    <div class="bg-white/90 rounded-3xl p-6 w-11/12 max-w-md text-center">
      <!-- Logos -->
      <div class="flex justify-between items-center mb-6">
        <img :src="festaLogo" alt="Festa" class="h-16" />
        <img :src="paposLogo" alt="Papos" class="h-16" />
      </div>

      <!-- Botones -->
      <div class="space-y-4">
        <button class="btn-principal">Carta comida</button>
        <button class="btn-principal">Carta cócteles</button>
        <button class="btn-principal">Promos del día</button>

        <div class="flex space-x-2 justify-center">
          <button class="btn-secundario">Reservas</button>
          <button class="btn-secundario">Delivery</button>
        </div>

        <button class="btn-principal">ENCUESTA</button>
      </div>

      <!-- Redes sociales -->
      <div class="mt-8 text-white">
        <p class="text-sm text-gray-700">Síguenos</p>
        <div class="flex justify-center space-x-4 mt-2">
          <img :src="facebookIcon" alt="Facebook" class="h-8" />
          <img :src="instagramIcon" alt="Instagram" class="h-8" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import festaLogo from '@/assets/festa-logo.jpg'
import paposLogo from '@/assets/papos-logo.jpg'
import fondo from '@/assets/fondo.jpg'
import facebookIcon from '@/assets/facebook.svg'
import instagramIcon from '@/assets/instagram.svg'
</script>

<style scoped>
.btn-principal {
  @apply bg-[#5e0b00] text-white rounded-full px-4 py-2 text-lg font-bold;
}
.btn-secundario {
  @apply bg-white text-[#5e0b00] rounded-full px-4 py-2 text-lg font-bold shadow;
}
</style>
