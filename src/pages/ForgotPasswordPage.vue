<template>
  <q-page padding class="flex flex-center">
    <q-card style="max-width: 400px; width: 100%">
      <q-card-section>
        <div class="text-h6 q-mb-md">Restablecer contraseña</div>

        <q-input
          v-model="email"
          label="Correo Electrónico"
          type="email"
          dense
          autofocus
          :rules="[(val) => !!val || 'El correo es requerido']"
        />

        <q-btn
          class="q-mt-md"
          label="Restablecer Contraseña"
          color="primary"
          @click="resetPassword"
          :loading="loading"
          :disable="loading"
          unelevated
        />
      </q-card-section>

      <q-card-actions align="center" class="q-pt-none">
        <q-btn flat color="primary" @click="goToLogin"> Volver a Iniciar Sesión </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from 'src/boot/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useQuasar } from 'quasar'

const email = ref('')
const loading = ref(false)
const $q = useQuasar()
const router = useRouter()

function resetPassword() {
  if (!email.value) {
    $q.notify({ type: 'negative', message: 'Por favor ingresa tu correo electrónico' })
    return
  }

  loading.value = true
  sendPasswordResetEmail(auth, email.value)
    .then(() => {
      $q.notify({ type: 'positive', message: 'Correo de restablecimiento enviado' })
      router.push('/login')
    })
    .catch((error) => {
      $q.notify({ type: 'negative', message: `Error: ${error.message}` })
    })
    .finally(() => {
      loading.value = false
    })
}

function goToLogin() {
  router.push('/login')
}
</script>
