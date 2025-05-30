<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      height: 100vh;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    "
  >
    <!-- Toolbar -->
    <header
      style="
        background-color: #1976d2;
        color: white;
        min-height: 56px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        font-weight: 500;
        font-size: 20px;
      "
    >
      Conteo de viajes
    </header>

    <!-- Texto de instrucciones -->
    <div style="text-align: center; color: black; margin: 10px 0; font-size: 14px">
      SELECCIONA LAS FECHAS A BUSCAR
    </div>

    <!-- Fechas -->
    <div style="display: flex; justify-content: space-between; margin: 0 10px 10px 10px">
      <input
        type="date"
        v-model="fechaInicio"
        style="
          flex: 1;
          text-align: center;
          color: black;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 4px;
        "
        placeholder="--/--/----"
      />
      <input
        type="date"
        v-model="fechaFin"
        style="
          flex: 1;
          text-align: center;
          color: black;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 4px;
        "
        placeholder="--/--/----"
      />
    </div>

    <!-- Botón Consultar -->
    <button
      @click="consultar"
      style="margin: 0 20px 20px 20px; padding: 10px; font-size: 16px; cursor: pointer"
    >
      Consultar
    </button>

    <!-- Contadores -->
    <div style="display: flex; justify-content: space-between; margin: 0 10px">
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center">
        <div style="font-weight: bold; font-size: 16px; color: black">
          {{ conteos.locales.count }}
        </div>
        <div style="text-align: center; color: black">LOCALES</div>
        <div style="text-align: center; color: black">{{ conteos.locales.total.toFixed(2) }}</div>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center">
        <div style="font-weight: bold; font-size: 16px; color: black">
          {{ conteos.aeropuertos.count }}
        </div>
        <div style="text-align: center; color: black">AEROPUERTOS</div>
        <div style="text-align: center; color: black">
          {{ conteos.aeropuertos.total.toFixed(2) }}
        </div>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center">
        <div style="font-weight: bold; font-size: 16px; color: black">
          {{ conteos.foraneos.count }}
        </div>
        <div style="text-align: center; color: black">FORANEOS</div>
        <div style="text-align: center; color: black">{{ conteos.foraneos.total.toFixed(2) }}</div>
      </div>
    </div>

    <!-- Lista de viajes -->
    <ul
      style="
        margin: 10px;
        padding: 0;
        list-style: none;
        overflow-y: auto;
        flex-grow: 1;
        border: 1px solid #ccc;
      "
    >
      <li
        v-for="viaje in viajes"
        :key="viaje.id"
        style="padding: 8px; border-bottom: 1px solid #eee; position: relative"
      >
        <div v-html="viaje.descripcion"></div>
        <button
          @click="eliminarViaje(viaje.id)"
          style="
            position: absolute;
            top: 8px;
            right: 8px;
            background-color: #d32f2f;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
          "
          title="Eliminar viaje"
        >
          🗑️
        </button>
      </li>
      <li v-if="!viajes.length" style="text-align: center; color: #999; padding: 10px">
        No hay viajes para mostrar
      </li>
    </ul>

    <!-- Botón descargar CSV -->
    <button
      @click="exportarCSV"
      style="
        margin: 10px;
        padding: 10px;
        background-color: #2196f3;
        color: white;
        border: none;
        cursor: pointer;
      "
    >
      Descargar CSV
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from 'boot/firebase'

export default {
  name: 'ConteoPage',
  setup() {
    const fechaInicio = ref('')
    const fechaFin = ref('')
    const viajes = ref([])

    const conteos = ref({
      locales: { count: 0, total: 0 },
      aeropuertos: { count: 0, total: 0 },
      foraneos: { count: 0, total: 0 },
    })

    const precios = ref({
      locales: 0,
      aeropuertos: 0,
      foraneos: 0,
    })

    async function cargarPrecios(uid) {
      try {
        const q = query(collection(db, 'Precios'), where('Uid', '==', uid))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          alert('No hay precios configurados para este usuario.')
          return
        }

        const data = querySnapshot.docs[0].data()
        precios.value.locales = parseFloat(data.precioLocal || 0)
        precios.value.aeropuertos = parseFloat(data.precioAeropuerto || 0)
        precios.value.foraneos = parseFloat(data.precioForaneo || 0)
      } catch (error) {
        console.error('Error al cargar precios:', error)
        alert('Error al cargar precios')
      }
    }

    async function consultar() {
      if (!fechaInicio.value || !fechaFin.value) {
        alert('Selecciona ambas fechas')
        return
      }

      const auth = getAuth()
      const user = auth.currentUser
      if (!user) {
        alert('No estás autenticado')
        return
      }

      const tsInicio = new Date(fechaInicio.value + 'T00:00:00')
      const tsFin = new Date(fechaFin.value + 'T23:59:59')

      await cargarPrecios(user.uid)

      try {
        const q = query(
          collection(db, 'Viajes'),
          where('uid', '==', user.uid),
          where('fechaControl', '>=', tsInicio),
          where('fechaControl', '<=', tsFin),
        )
        const querySnapshot = await getDocs(q)

        const listaViajes = []
        const conteoTemp = {
          locales: { count: 0, total: 0 },
          aeropuertos: { count: 0, total: 0 },
          foraneos: { count: 0, total: 0 },
        }

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          const tipo = (data.tipoServicio || '').toLowerCase()

          listaViajes.push({
            id: doc.id,
            descripcion: ` ${data.planta || ''} <br>
              ${data.fecha || ''} <br>
              ${data.hora || ''} <br>
              ${data.tipoServicio || ''} <br>
              Pasajero: ${data.personal || 'N/A'} <br>
               ${data.vehiculo || 'N/A'} <br>
              ${data.descripcion || ''}`,
          })

          if (tipo.includes('local') || tipo.includes('entrada') || tipo.includes('salida')) {
            conteoTemp.locales.count++
            conteoTemp.locales.total += precios.value.locales
          } else if (tipo.includes('aeropuerto')) {
            conteoTemp.aeropuertos.count++
            conteoTemp.aeropuertos.total += precios.value.aeropuertos
          } else if (tipo.includes('foraneo')) {
            conteoTemp.foraneos.count++
            conteoTemp.foraneos.total += precios.value.foraneos
          }
        })

        viajes.value = listaViajes
        conteos.value = conteoTemp
      } catch (error) {
        console.error('Error al consultar viajes:', error)
        alert('Error al consultar viajes, revisa la consola.')
      }
    }

    async function eliminarViaje(id) {
      const confirmado = confirm('¿Estás seguro de eliminar este viaje?')
      if (!confirmado) return

      try {
        await deleteDoc(doc(db, 'Viajes', id))
        viajes.value = viajes.value.filter((v) => v.id !== id)
        alert('Viaje eliminado correctamente')
      } catch (error) {
        console.error('Error al eliminar viaje:', error)
        alert('Hubo un error al eliminar el viaje')
      }
    }
    function exportarCSV() {
      if (!viajes.value.length) {
        alert('No hay datos para exportar')
        return
      }

      const headers = [
        'Planta',
        'Fecha',
        'Hora',
        'Tipo de servicio',
        'Pasajero',
        'Vehiculo',
        'Descripción',
      ]

      const rows = viajes.value.map((v) => {
        const partes = v.descripcion.split('<br>').map((p) => p.trim())

        const planta = partes[0] || ''
        const fecha = partes[1] || ''
        const hora = partes[2] || ''
        const tipoServicio = partes[3] || ''
        const pasajero = (partes[4] || '').replace(/^Pasajero:\s*/, '')
        const vehiculo = partes[5] || ''
        const descripcion = partes[6] || ''

        return [planta, fecha, hora, tipoServicio, pasajero, vehiculo, descripcion]
      })

      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += headers.join(',') + '\n'
      rows.forEach((row) => {
        const escapedRow = row.map((field) => `"${String(field).replace(/"/g, '""')}"`)
        csvContent += escapedRow.join(',') + '\n'
      })

      // Agregar 4 saltos de línea
      csvContent += '\n\n\n\n'

      // Agregar resumen usando conteos.value que debes asegurarte que esté accesible en este scope
      // Asumiendo que tienes conteos en el setup y está disponible aquí, sino pásalo como parámetro o accede globalmente
      csvContent += `"Locales:",${conteos.value.locales.count}\n`
      csvContent += `"Aeropuertos:",${conteos.value.aeropuertos.count}\n`
      csvContent += `"Foraneos:",${conteos.value.foraneos.count}\n`

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'viajes.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    return {
      fechaInicio,
      fechaFin,
      viajes,
      conteos,
      consultar,
      exportarCSV,
      eliminarViaje,
    }
  },
}
</script>
