<template>
  <q-page padding>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>Vehículos</q-toolbar-title>
    </q-toolbar>

    <div class="q-my-md text-center text-bold">Vehículos registrados por el usuario</div>

    <q-list bordered separator v-if="vehiculos.length">
      <q-item
        v-for="vehiculo in vehiculos"
        :key="vehiculo.id"
        clickable
        @click="confirmarEliminacion(vehiculo.id)"
      >
        <q-item-section>
          <q-item-label>{{ vehiculo.nombre }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <div v-else class="text-center text-grey q-mt-md">No hay vehículos registrados.</div>

    <!-- Diálogo de confirmación -->
    <q-dialog v-model="dialogoEliminar">
      <q-card>
        <q-card-section class="text-h6"> Eliminar Vehículo </q-card-section>
        <q-card-section> ¿Estás seguro de que deseas eliminar este vehículo? </q-card-section>
        <q-card-actions>
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Eliminar" color="red" @click="eliminarVehiculo" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { auth, db } from 'boot/firebase'

const $q = useQuasar()

const vehiculos = ref([])
const dialogoEliminar = ref(false)
const idAEliminar = ref(null)

const cargarVehiculos = async () => {
  vehiculos.value = []
  const uid = auth.currentUser?.uid
  if (!uid) return

  const q = query(collection(db, 'Vehiculos'), where('uid', '==', uid))
  const snapshot = await getDocs(q)
  snapshot.forEach((docSnap) => {
    vehiculos.value.push({
      id: docSnap.id,
      nombre: docSnap.data().nombre || 'Sin nombre',
    })
  })
}

const confirmarEliminacion = (id) => {
  idAEliminar.value = id
  dialogoEliminar.value = true
}

const eliminarVehiculo = async () => {
  try {
    await deleteDoc(doc(db, 'Vehiculos', idAEliminar.value))
    $q.notify({
      type: 'positive',
      message: 'Vehículo eliminado correctamente',
    })
    dialogoEliminar.value = false
    await cargarVehiculos()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Error al eliminar vehículo: ${error.message}`,
    })
  }
}

onMounted(() => {
  cargarVehiculos()
})
</script>
