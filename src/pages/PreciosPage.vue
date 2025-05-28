<template>
  <q-page class="q-pa-md">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>PRECIOS POR VIAJE</q-toolbar-title>
    </q-toolbar>

    <div class="text-center q-mt-md">
      <div class="text-subtitle1 q-mb-md">GUARDA LAS GANANCIAS UNITARIAS POR TIPO DE VIAJE</div>
    </div>

    <!-- Inputs -->
    <q-input v-model="precioLocal" label="Locales" type="number" class="q-mb-md" filled />
    <q-input v-model="precioForaneo" label="Foráneos" type="number" class="q-mb-md" filled />
    <q-input v-model="precioAeropuerto" label="Aeropuertos" type="number" class="q-mb-md" filled />

    <q-btn label="GUARDAR" color="primary" class="full-width q-my-md" @click="guardarPrecios" />

    <!-- Precios actuales -->
    <div class="text-center text-subtitle1 q-mt-xl q-mb-sm">PRECIOS ACTUALES</div>

    <div class="row q-col-gutter-md">
      <div class="col-4 text-center">
        <div class="text-h6">{{ preciosActuales.local }}</div>
        <div class="text-caption">LOCALES</div>
      </div>
      <div class="col-4 text-center">
        <div class="text-h6">{{ preciosActuales.aeropuerto }}</div>
        <div class="text-caption">AEROPUERTOS</div>
      </div>
      <div class="col-4 text-center">
        <div class="text-h6">{{ preciosActuales.foraneo }}</div>
        <div class="text-caption">FORÁNEOS</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'

const $q = useQuasar()
const db = getFirestore()
const auth = getAuth()

const precioLocal = ref('')
const precioForaneo = ref('')
const precioAeropuerto = ref('')

const preciosActuales = ref({
  local: '0',
  foraneo: '0',
  aeropuerto: '0',
})

const limpiarCampos = () => {
  precioLocal.value = ''
  precioForaneo.value = ''
  precioAeropuerto.value = ''
}

const guardarPrecios = async () => {
  const uid = auth.currentUser?.uid
  if (!uid) {
    $q.notify({ type: 'negative', message: 'No hay usuario autenticado' })
    return
  }

  if (!precioLocal.value && !precioForaneo.value && !precioAeropuerto.value) {
    $q.notify({ type: 'warning', message: 'Ingresa al menos un precio' })
    return
  }

  try {
    await setDoc(doc(db, 'Precios', uid), {
      precioLocal: precioLocal.value,
      precioForaneo: precioForaneo.value,
      precioAeropuerto: precioAeropuerto.value,
      Uid: uid,
    })

    $q.notify({ type: 'positive', message: 'Precios guardados correctamente' })
    limpiarCampos()
    obtenerPrecios()
  } catch (error) {
    console.error('Error al guardar precios:', error)
    $q.notify({ type: 'negative', message: 'Error al guardar precios' })
  }
}

const obtenerPrecios = async () => {
  const uid = auth.currentUser?.uid
  if (!uid) return

  try {
    const docSnap = await getDoc(doc(db, 'Precios', uid))
    if (docSnap.exists()) {
      const data = docSnap.data()
      preciosActuales.value.local = data.precioLocal || '0'
      preciosActuales.value.foraneo = data.precioForaneo || '0'
      preciosActuales.value.aeropuerto = data.precioAeropuerto || '0'
    }
  } catch (error) {
    console.error('Error al obtener precios:', error)
  }
}

onMounted(() => {
  obtenerPrecios()
})
</script>
