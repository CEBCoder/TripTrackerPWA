<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card style="width: 360px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6 q-mb-md">Registrar nueva cuenta</div>

        <q-input v-model="email" label="Correo Electrónico" type="email" outlined dense clearable />

        <q-input
          v-model="password"
          label="Contraseña"
          type="password"
          outlined
          dense
          clearable
          class="q-mt-md"
        />

        <q-input
          v-model="confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          outlined
          dense
          clearable
          class="q-mt-md"
        />

        <q-btn
          label="Registrar"
          color="primary"
          class="full-width q-mt-lg"
          @click="onRegister"
          :loading="loading"
          :disable="loading"
        />

        <div class="q-mt-md text-center">
          <q-btn
            flat
            label="¿Ya tienes una cuenta? Inicia sesión"
            color="primary"
            @click="goToLogin"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from 'src/boot/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

function goToLogin() {
  router.push('/login') // Ajusta la ruta según tu router
}

async function onRegister() {
  if (!email.value || !password.value || !confirmPassword.value) {
    $q.notify({ type: 'negative', message: 'Por favor completa todos los campos' })
    return
  }
  if (password.value !== confirmPassword.value) {
    $q.notify({ type: 'negative', message: 'Las contraseñas no coinciden' })
    return
  }

  loading.value = true

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    $q.notify({
      type: 'positive',
      message: `¡Registro exitoso! Bienvenido, ${userCredential.user.email}`,
    })
    router.push('/login')
  } catch (error) {
    $q.notify({ type: 'negative', message: `Error: ${error.message}` })
  } finally {
    loading.value = false
  }
}
</script>
