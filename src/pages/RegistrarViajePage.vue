<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-pa-lg shadow-2 rounded-borders">
      <q-card-section>
        <div class="text-h6">Registrar Viaje</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <!-- Tipo de servicio -->
        <q-select
          v-model="tipoServicio"
          :options="['Entrada', 'Salida', 'Aeropuerto', 'Foráneo']"
          label="Tipo de Servicio"
          dense
          outlined
        />

        <!-- Fecha -->
        <q-input v-model="fecha" label="Fecha" dense outlined readonly>
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy>
                <q-date v-model="fecha" mask="YYYY-MM-DD" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- Hora -->
        <q-input v-model="hora" label="Hora" dense outlined readonly>
          <template #append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy>
                <q-time v-model="hora" format24h />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- Planta -->
        <div class="row items-center">
          <q-select
            class="col"
            v-model="planta"
            :options="plantas"
            label="Planta"
            dense
            outlined
            use-input
            emit-value
            map-options
            option-label="nombre"
            option-value="nombre"
          />
          <q-btn icon="add" color="primary" round dense flat @click="abrirDialogoPlanta = true" />
        </div>

        <!-- Vehículo -->
        <div class="row items-center">
          <q-select
            class="col"
            v-model="vehiculo"
            :options="vehiculos"
            label="Vehículo"
            dense
            outlined
            use-input
            emit-value
            map-options
            option-label="nombre"
            option-value="nombre"
          />
          <q-btn icon="add" color="primary" round dense flat @click="abrirDialogoVehiculo = true" />
        </div>

        <!-- Personal -->
        <q-input v-model="personal" label="Personal" dense outlined />

        <!-- Descripción -->
        <q-input v-model="descripcion" label="Descripción" dense outlined type="textarea" />
      </q-card-section>

      <q-card-actions>
        <q-btn label="Guardar" color="primary" @click="guardarViaje" />
      </q-card-actions>
    </q-card>

    <!-- Diálogo agregar planta -->
    <q-dialog v-model="abrirDialogoPlanta">
      <q-card>
        <q-card-section>
          <div class="text-h6">Agregar Planta</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="nuevaPlanta" label="Nombre de Planta" />
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Agregar" color="primary" @click="agregarPlanta" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo agregar vehículo -->
    <q-dialog v-model="abrirDialogoVehiculo">
      <q-card>
        <q-card-section>
          <div class="text-h6">Agregar Vehículo</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="nuevoVehiculo" label="Nombre de Vehículo" />
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Agregar" color="primary" @click="agregarVehiculo" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { db, auth } from 'boot/firebase'
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'

// Quasar y Router
const $q = useQuasar()
const router = useRouter()

// Estado
const tipoServicio = ref('Entrada')
const fecha = ref('')
const hora = ref('')
const planta = ref('')
const vehiculo = ref('')
const personal = ref('')
const descripcion = ref('')

const plantas = ref([])
const vehiculos = ref([])

const abrirDialogoPlanta = ref(false)
const abrirDialogoVehiculo = ref(false)
const nuevaPlanta = ref('')
const nuevoVehiculo = ref('')

// Función para obtener uid en tiempo real
const getUid = () => auth.currentUser?.uid

// Función para cargar plantas filtrando por uid
const cargarPlantas = async () => {
  const uid = getUid()
  if (!uid) return
  const plantasQuery = query(collection(db, 'Plantas'), where('uid', '==', uid))
  const plantasSnapshot = await getDocs(plantasQuery)
  plantas.value = plantasSnapshot.docs.map((doc) => ({
    id: doc.id,
    nombre: doc.data().nombre,
  }))
}

// Función para cargar vehículos filtrando por uid
const cargarVehiculos = async () => {
  const uid = getUid()
  if (!uid) return
  const vehiculosQuery = query(collection(db, 'Vehiculos'), where('uid', '==', uid))
  const vehiculosSnapshot = await getDocs(vehiculosQuery)
  vehiculos.value = vehiculosSnapshot.docs.map((doc) => ({
    id: doc.id,
    nombre: doc.data().nombre,
  }))
}

// Función para obtener la fecha y hora actual
const obtenerFechaHoraActual = () => {
  const ahora = new Date()
  const yyyy = ahora.getFullYear()
  const mm = String(ahora.getMonth() + 1).padStart(2, '0')
  const dd = String(ahora.getDate()).padStart(2, '0')
  const hh = String(ahora.getHours()).padStart(2, '0')
  const min = String(ahora.getMinutes()).padStart(2, '0')
  fecha.value = `${yyyy}-${mm}-${dd}`
  hora.value = `${hh}:${min}`
}

// Cargar datos al montar
onMounted(() => {
  cargarPlantas()
  cargarVehiculos()
  obtenerFechaHoraActual()
})

// Actualizar descripción automáticamente según tipo de servicio
watch(tipoServicio, (nuevo) => {
  switch (nuevo) {
    case 'Entrada':
      descripcion.value = 'H - P'
      break
    case 'Salida':
      descripcion.value = 'P - H'
      break
    case 'Aeropuerto':
      descripcion.value = 'CUU'
      break
    case 'Foráneo':
      descripcion.value = 'Con destino a'
      break
    default:
      descripcion.value = ''
  }
})

// Agregar planta
const agregarPlanta = async () => {
  if (!nuevaPlanta.value.trim()) return
  const uid = getUid()
  if (!uid) {
    $q.notify({ type: 'negative', message: 'No hay usuario autenticado' })
    return
  }
  await addDoc(collection(db, 'Plantas'), {
    nombre: nuevaPlanta.value.trim(),
    uid,
  })
  await cargarPlantas()
  planta.value = ''
  nuevaPlanta.value = ''
  abrirDialogoPlanta.value = false
}

// Agregar vehículo
const agregarVehiculo = async () => {
  if (!nuevoVehiculo.value.trim()) return
  const uid = getUid()
  if (!uid) {
    $q.notify({ type: 'negative', message: 'No hay usuario autenticado' })
    return
  }
  await addDoc(collection(db, 'Vehiculos'), {
    nombre: nuevoVehiculo.value.trim(),
    uid,
  })
  await cargarVehiculos()
  vehiculo.value = ''
  nuevoVehiculo.value = ''
  abrirDialogoVehiculo.value = false
}

// Guardar viaje
const guardarViaje = async () => {
  if (!fecha.value || !hora.value || !planta.value || !vehiculo.value || !personal.value) {
    $q.notify({
      type: 'warning',
      message: 'Por favor completa todos los campos obligatorios.',
    })
    return
  }

  const uid = getUid()
  if (!uid) {
    $q.notify({
      type: 'negative',
      message: 'No hay usuario autenticado',
    })
    return
  }

  const viaje = {
    tipoServicio: tipoServicio.value,
    fecha: fecha.value,
    hora: hora.value,
    planta: planta.value,
    vehiculo: vehiculo.value,
    personal: personal.value,
    descripcion: descripcion.value,
    uid,
    fechaControl: new Date(`${fecha.value} ${hora.value}`),
  }

  try {
    await addDoc(collection(db, 'Viajes'), viaje)

    $q.notify({
      type: 'positive',
      message: 'Viaje guardado correctamente.',
      timeout: 1500,
      position: 'top',
    })

    setTimeout(() => {
      router.push('/main-chofer') // Asegúrate que esta ruta exista
    }, 1600)
  } catch (e) {
    console.error('Error al guardar el viaje:', e)
    $q.notify({
      type: 'negative',
      message: 'Error al guardar el viaje.',
    })
  }

  planta.value = ''
  vehiculo.value = ''
  personal.value = ''
  descripcion.value = 'H - P'
}
</script>
