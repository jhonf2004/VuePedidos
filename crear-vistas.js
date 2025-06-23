import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const views = [
  'CartaComida',
  'CartaCocteles',
  'Promos',
  'Reservas',
  'Delivery',
  'Encuesta'
]

const basePath = path.join(__dirname, 'src', 'views')

async function crearVistas() {
  try {
    // Crear carpeta si no existe
    await fs.mkdir(basePath, { recursive: true })

    for (const view of views) {
      const filePath = path.join(basePath, `${view}.vue`)
      const content = `<template>
  <div>
    <h1>${view}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: '${view}',
})
</script>
`

      await fs.writeFile(filePath, content)
      console.log(`Archivo creado: ${filePath}`)
    }
  } catch (error) {
    console.error('Error creando vistas:', error)
  }
}

crearVistas()
