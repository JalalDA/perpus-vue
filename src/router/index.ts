import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layout/default-layout.vue'
import Home from '../views/Home.vue'
import Buku from '../views/Buku.vue'
import Mahasiswa from '../views/Mahasiswa.vue'
import Peminjaman from '../views/Peminjaman.vue'
import History from '../views/History.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      {
        path: 'buku',
        name: 'Buku',
        component: Buku,
      },
      {
        path: 'mahasiswa',
        name: 'Mahasiswa',
        component: Mahasiswa,
      },
      {
        path: 'peminjaman',
        name: 'Peminjaman',
        component: Peminjaman,
      },
      {
        path: 'history',
        name: 'History',
        component: History,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
