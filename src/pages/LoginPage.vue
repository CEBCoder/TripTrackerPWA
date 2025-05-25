<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg" style="max-width: 400px; width: 100%">
      <q-card-section class="q-gutter-md">
        <img :src="triptrackerImg" alt="Trip Tracker Logo" style="width: 260px; height: 230px" />
        <q-input v-model="email" label="Correo Electrónico" type="email" outlined />
        <q-input v-model="password" label="Contraseña" type="password" outlined />

        <q-btn label="Iniciar Sesión" color="primary" @click="loginUser" class="full-width" />

        <div class="text-blue text-caption cursor-pointer" @click="goToForgotPassword">
          ¿Olvidaste tu contraseña?
        </div>

        <div class="text-blue text-caption cursor-pointer" @click="goToRegister">
          ¿No tienes cuenta? Regístrate
        </div>

        <div
          class="text-caption text-bold text-center q-mt-md cursor-pointer"
          @click="showVersionDialog"
        >
          versión 1.0
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import triptrackerImg from 'src/assets/triptracker.png'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from 'src/boot/firebase' // Asegúrate de tener firebase inicializado aquí
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const email = ref('')
const password = ref('')

// Si el usuario ya está autenticado, redirigirlo
onMounted(() => {
  const user = auth.currentUser
  if (user) {
    router.push('/main-chofer') // Ajusta esta ruta según tu router
  }
})

function loginUser() {
  if (!email.value || !password.value) {
    $q.notify({ type: 'warning', message: 'Por favor ingresa tus credenciales' })
    return
  }

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user
      $q.notify({ type: 'positive', message: `¡Bienvenido, ${user.email}!` })
      router.push('/main-chofer') // Ajusta esta ruta
    })
    .catch((error) => {
      $q.notify({ type: 'negative', message: `Error: ${error.message}` })
    })
}

function goToForgotPassword() {
  router.push('/forgot-password') // Asegúrate de tener esta ruta
}

function goToRegister() {
  router.push('/register') // Asegúrate de tener esta ruta
}

function showVersionDialog() {
  $q.dialog({
    title: 'Versión 1.0',
    message:
      'Estamos muy contentos y esperamos que disfrutes la versión 1.0 de nuestra aplicación TripTracker.\n\nAquí podrás llevar tu control de viajes, vehículos manejados y plantas.\n\nSiempre estamos abiertos a comentarios y sugerencias. \nContactanos al correo cebcoder@gmail.com',
  })
}
</script>
