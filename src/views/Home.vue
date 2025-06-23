<template>
  <div class="w-screen h-screen bg-cover bg-center flex items-center justify-center"
    :style="{ backgroundImage: `url(${fondo})` }">
    <!-- Overlay para oscurecer el fondo -->
    <div class="absolute inset-0 bg-black bg-opacity-40"></div>
    
    <!-- Contenido principal -->
    <div class="relative z-10 flex items-center justify-center min-h-screen p-4">
      <div class="bg-white/90 rounded-3xl p-6 w-11/12 max-w-md text-center shadow-lg backdrop-blur-sm">
        
        <!-- Header con logos -->
        <div class="flex items-center justify-between mb-8">
          <!-- Logo Festa -->
          <div class="flex-1 text-center">
            <img src="../festa-logo.jpg" alt="Festa Restobar" class="h-12 mx-auto mb-2" />
            <div class="text-2xl font-bold tracking-wider text-gray-800">
              F E S T A
            </div>
            <div class="text-xs tracking-widest text-gray-600 font-light">
              R E S T O B A R
            </div>
          </div>
          
          <!-- Logo Papo's -->
          <div class="flex-shrink-0 ml-4">
            <img src="../papos-logo.jpg" alt="Papo's Lounge" class="h-16 w-16 rounded-full" />
          </div>
        </div>

        <!-- Botones del menú -->
        <div class="space-y-4">
          <!-- Carta comida -->
          <button class="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-4 px-6 rounded-full text-lg transition-colors duration-200 shadow-lg">
            Carta comida
          </button>

          <!-- Carta cócteles -->
          <button class="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-4 px-6 rounded-full text-lg transition-colors duration-200 shadow-lg">
            Carta cócteles
          </button>

          <!-- Promos del día -->
          <button class="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-4 px-6 rounded-full text-lg transition-colors duration-200 shadow-lg">
            Promos del día
          </button>

          <!-- Reservas y Delivery -->
          <div class="flex space-x-3">
            <button class="flex-1 bg-white border-2 border-amber-800 text-amber-800 font-bold py-3 px-4 rounded-full text-base hover:bg-amber-50 transition-colors duration-200">
              Reservas
            </button>
            <button class="flex-1 bg-white border-2 border-amber-800 text-amber-800 font-bold py-3 px-4 rounded-full text-base hover:bg-amber-50 transition-colors duration-200">
              Delivery
            </button>
          </div>

          <!-- Encuesta -->
          <button class="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-4 px-6 rounded-full text-lg transition-colors duration-200 shadow-lg">
            ENCUESTA
          </button>
        </div>

        <!-- Síguenos -->
        <div class="mt-8 text-center">
          <p class="text-gray-600 text-sm mb-4">Síguenos</p>
          <div class="flex justify-center space-x-4">
            <!-- Facebook -->
            <a href="#" class="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-900 transition-colors duration-200">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            
            <!-- Instagram -->
            <a href="#" class="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-900 transition-colors duration-200">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986c6.618 0 11.986-5.368 11.986-11.986C24.003 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.326-1.297-.878-.808-1.297-1.959-1.297-3.257 0-1.297.42-2.448 1.297-3.326.878-.878 2.029-1.297 3.326-1.297 1.297 0 2.448.42 3.257 1.297.808.878 1.297 2.029 1.297 3.326 0 1.298-.49 2.449-1.297 3.257-.808.808-1.96 1.297-3.257 1.297zm7.83-9.404c-.878 0-1.595-.717-1.595-1.595 0-.878.717-1.595 1.595-1.595.878 0 1.595.717 1.595 1.595 0 .878-.717 1.595-1.595 1.595zm-4.282.717c-.878 0-1.595.717-1.595 1.595s.717 1.595 1.595 1.595 1.595-.717 1.595-1.595-.717-1.595-1.595-1.595z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import fondo from '@/assets/fondo.jpg'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FestaMenu',
  methods: {
    handleMenuClick(section: string) {
      console.log(`Navegando a: ${section}`)
      // Aquí puedes agregar la lógica de navegación
      // Por ejemplo: this.$router.push(`/${section}`)
    }
  }
})
</script>

<style scoped>
/* Estilos adicionales si necesitas algo específico */
</style>