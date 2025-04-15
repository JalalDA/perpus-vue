<template>
  <div class="min-h-screen flex w-screen flex-col bg-gray-100">
    <!-- Header -->
    <header class="bg-[#815e22] text-white shadow-md">
      <div class="px-6 py-4 flex justify-between items-center">
        <div class="text-2xl font-bold">Perpustakaan</div>
        <nav class="flex gap-6 text-md">
          <router-link to="/" class="hover:underline">
            <div class="text-white" :class="route?.path === '/' ? 'underline font-bold' : ''">Home</div>
          </router-link>
          <router-link to="/buku" class="hover:underline">
            <div class="text-white" :class="route?.path.startsWith('/buku') ? 'underline font-bold' : ''">Buku</div>
          </router-link>
          <router-link to="/mahasiswa" class="hover:underline">
            <div class="text-white" :class="route?.path.startsWith('/mahasiswa') ? 'underline font-bold' : ''">Mahasiswa</div>
          </router-link>
          <router-link to="/peminjaman" class="hover:underline">
            <div class="text-white" :class="route?.path.startsWith('/peminjaman') ? 'underline font-bold' : ''">Peminjaman</div>
          </router-link>
          <router-link to="/history" class="hover:underline">
            <div class="text-white" :class="route?.path.startsWith('/history') ? 'underline font-bold' : ''">History</div>
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 mx-auto">
      <router-view />
    </main>

    <!-- Footer (optional) -->
    <footer class="bg-[#815e22] text-white text-center text-sm py-4">
      &copy; {{ new Date().getFullYear() }} Perpustakaan App
    </footer>
  </div>
</template>


<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
console.log(route.path);

</script>
