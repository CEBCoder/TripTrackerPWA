// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAob_BLweFRMH1XImtWjvj6G_OUTJSpgSA',
  authDomain: 'viajes-2244f.firebaseapp.com',
  projectId: 'viajes-2244f',
  storageBucket: 'viajes-2244f.firebasestorage.app',
  messagingSenderId: '454135115189',
  appId: '1:454135115189:web:8933097736b995746e7dfc',
  measurementId: 'G-EL9Y52CTQM',
}

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig)

// Inicializar Auth
const auth = getAuth(firebaseApp)

export { auth }
