<template>
  <q-page class="q-pa-md column items-center">
    <!-- Toolbar -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>TripTracker</q-toolbar-title>
    </q-toolbar>

    <!-- Botones grandes con íconos o imágenes -->

    <div class="q-my-md">
      <q-btn
        icon="attach_money"
        label="Precios"
        color="primary"
        style="width: 150px; height: 150px"
        rounded
        @click="goTo('precios')"
        class="q-mb-sm"
      />
    </div>

    <div class="q-my-md">
      <q-btn
        icon="directions_car"
        label="Vehículos"
        color="primary"
        rounded
        style="width: 150px; height: 150px"
        @click="goTo('vehiculos')"
        class="q-mb-sm"
      />
    </div>

    <div class="q-my-md">
      <q-btn
        icon="location_city"
        label="Plantas"
        color="primary"
        rounded
        style="width: 150px; height: 150px"
        @click="goTo('plantas')"
        class="q-mb-sm"
      />
    </div>

    <!-- Espacio para empujar el footer abajo -->

    <!-- Footer fijo abajo -->
    <q-footer elevated class="bg-white text-dark">
      <div class="row justify-around q-pa-sm">
        <q-btn flat dense @click="goTo('conteo')" class="column items-center q-mx-sm">
          <div class="column items-center">
            <q-icon name="bar_chart" size="32px" class="q-mb-xs" />
            <div class="text-caption">Conteo</div>
          </div>
        </q-btn>

        <q-btn flat dense @click="goTo('registro')" class="column items-center q-mx-sm">
          <div class="column items-center">
            <q-icon name="edit_note" size="32px" class="q-mb-xs" />
            <div class="text-caption">Registro</div>
          </div>
        </q-btn>

        <q-btn flat dense @click="logout" class="column items-center q-mx-sm">
          <div class="column items-center">
            <q-icon name="logout" size="32px" class="q-mb-xs" />
            <div class="text-caption">Salir</div>
          </div>
        </q-btn>
      </div>
    </q-footer>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const auth = getAuth()

function goTo(route) {
  switch (route) {
    case 'precios':
      router.push('/precios')
      break
    case 'vehiculos':
      router.push('/vehiculos')
      break
    case 'plantas':
      router.push('/plantas')
      break
    case 'conteo':
      router.push('/conteo')
      break
    case 'registro':
      router.push('/registro')
      break
  }
}

function logout() {
  signOut(auth)
    .then(() => {
      router.replace('/login')
    })
    .catch((error) => {
      $q.notify({ type: 'negative', message: 'Error al cerrar sesión' })
      console.error(error)
    })
}
</script>

<style scoped>
.q-img {
  border-radius: 16px;
}
</style>
