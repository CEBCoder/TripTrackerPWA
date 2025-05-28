<template>
  <q-page padding>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>Plantas</q-toolbar-title>
    </q-toolbar>

    <div class="q-my-md text-center text-bold">Plantas registradas por el usuario</div>

    <q-list bordered separator v-if="plantas.length">
      <q-item
        v-for="planta in plantas"
        :key="planta.id"
        clickable
        @click="confirmarEliminacion(planta.id)"
      >
        <q-item-section>
          <q-item-label>{{ planta.nombre }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <div v-else class="text-center text-grey q-mt-md">No hay plantas registradas.</div>

    <q-dialog v-model="dialogoEliminar">
      <q-card>
        <q-card-section class="text-h6">Eliminar Planta</q-card-section>
        <q-card-section>¿Estás seguro de que deseas eliminar esta planta?</q-card-section>
        <q-card-actions>
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Eliminar" color="red" @click="eliminarPlanta" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { auth, db } from 'boot/firebase'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'

const $q = useQuasar()

const plantas = ref([])
const dialogoEliminar = ref(false)
const idAEliminar = ref(null)

const cargarPlantas = async () => {
  plantas.value = []
  const uid = auth.currentUser?.uid
  if (!uid) return

  const q = query(collection(db, 'Plantas'), where('uid', '==', uid))
  const snapshot = await getDocs(q)

  snapshot.forEach((docSnap) => {
    plantas.value.push({
      id: docSnap.id,
      nombre: docSnap.data().nombre || 'Sin nombre',
    })
  })
}

const confirmarEliminacion = (id) => {
  idAEliminar.value = id
  dialogoEliminar.value = true
}

const eliminarPlanta = async () => {
  try {
    await deleteDoc(doc(db, 'Plantas', idAEliminar.value))
    $q.notify({
      type: 'positive',
      message: 'Planta eliminada correctamente',
    })
    dialogoEliminar.value = false
    await cargarPlantas()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Error al eliminar planta: ${error.message}`,
    })
  }
}

onMounted(() => {
  cargarPlantas()
})
</script>
