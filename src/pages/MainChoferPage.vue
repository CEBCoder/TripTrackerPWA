<template>
  <q-page padding class="flex flex-col items-center justify-between">
    <!-- Toolbar -->
    <q-header elevated>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>TripTracker</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Contenido central: botones con imágenes -->
    <div class="q-my-md flex flex-col items-center gap-md" style="max-width: 200px; width: 100%">
      <q-btn
        flat
        unelevated
        class="q-my-sm"
        icon="attach_money"
        label="Precios"
        style="width: 130px; height: 130px; font-size: 16px"
        @click="goToPrecios"
      >
        <template #prepend>
          <q-img src="statics/precios.png" style="width: 130px; height: 130px" />
        </template>
      </q-btn>

      <q-btn
        flat
        unelevated
        class="q-my-sm"
        icon="directions_bus"
        label="Vehículos"
        style="width: 130px; height: 130px; font-size: 16px"
        @click="goToVehiculos"
      >
        <template #prepend>
          <q-img src="statics/vehiculos.png" style="width: 130px; height: 130px" />
        </template>
      </q-btn>

      <q-btn
        flat
        unelevated
        class="q-my-sm"
        icon="domain"
        label="Plantas"
        style="width: 130px; height: 130px; font-size: 16px"
        @click="goToPlantas"
      >
        <template #prepend>
          <q-img src="statics/plantas.png" style="width: 130px; height: 130px" />
        </template>
      </q-btn>
    </div>

    <!-- Bottom Menu -->
    <q-footer elevated class="bg-white q-px-md q-py-sm">
      <q-btn-group spread class="full-width">
        <q-btn flat label="Conteo" icon="format_list_numbered" @click="goToConteo" />

        <q-btn flat label="Registro" icon="edit_note" @click="goToRegistro" />

        <q-btn flat label="Salir" icon="logout" color="negative" @click="logout" />
      </q-btn-group>
    </q-footer>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { auth } from 'src/boot/firebase'

const router = useRouter()

function goToPrecios() {
  router.push('/precios')
}

function goToVehiculos() {
  router.push('/vehiculos')
}

function goToPlantas() {
  router.push('/plantas')
}

function goToConteo() {
  router.push('/conteo')
}

function goToRegistro() {
  router.push('/registro')
}

function logout() {
  auth.signOut().then(() => {
    router.push('/login')
  })
}
</script>

<style scoped>
/* Puedes agregar estilos específicos aquí si quieres */
</style>
