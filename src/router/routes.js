import LoginPage from 'src/pages/LoginPage.vue'
import SignInPage from 'src/pages/SignInPage.vue'
import MainChofer from 'src/pages/MainChoferPage.vue'
import ForgotPasswordPage from 'src/pages/ForgotPasswordPage.vue'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'), // Ajusta según tu layout
    children: [
      { path: '', redirect: '/login' }, // Ruta por defecto redirige a login
      { path: 'login', component: LoginPage },
      { path: 'register', component: SignInPage },
      { path: 'main-chofer', component: MainChofer },
      { path: 'forgot-password', component: ForgotPasswordPage },
    ],
  },

  // Ruta fallback para 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
