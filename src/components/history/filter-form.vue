<template>
    <DialogRoot>
      <DialogTrigger as-child>
        <div class="px-4 py-2 bg-[#815e22] text-white cursor-pointer rounded-md">
          Filter
        </div>
      </DialogTrigger>
  
      <DialogPortal>
        <DialogOverlay class="fixed inset-0 bg-black/50 z-40" />
        <DialogContent
          class="fixed top-1/2 left-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50"
        >
          <DialogTitle class="text-lg font-semibold mb-4">Filter Data Peminjaman</DialogTitle>
          <DialogDescription class="text-sm text-gray-500 mb-6">
            Silakan isi kriteria filter untuk mencari data peminjaman.
          </DialogDescription>
  
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="filters.nim" type="text" placeholder="NIM" class="border p-2 rounded-md w-full" />
            <input v-model="filters.namaMahasiswa" type="text" placeholder="Nama Mahasiswa" class="border p-2 rounded-md w-full" />
            <input v-model="filters.idBuku" type="text" placeholder="ID Buku" class="border p-2 rounded-md w-full" />
            <input v-model="filters.namaBuku" type="text" placeholder="Nama Buku" class="border p-2 rounded-md w-full" />
            <input v-model="filters.tanggalPinjam" type="date" class="border p-2 rounded-md w-full" />
            <input v-model="filters.tanggalKembali" type="date" class="border p-2 rounded-md w-full" />
            <input v-model.number="filters.lamaPinjam" type="number" placeholder="Lama Pinjam (hari)" class="border p-2 rounded-md w-full" />
          </div>
  
          <div class="flex justify-end gap-2 mt-6">
            <DialogClose as-child>
              <div class="px-4 py-2 bg-gray-400 cursor-pointer text-white rounded" @click="resetFilter">
                Reset
             </div>
            </DialogClose>
            <DialogClose as-child>
              <div class="px-4 py-2 bg-[#815e22] cursor-pointer text-white rounded" @click="submitFilter">
                Terapkan
              </div>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </template>
  
  <script setup lang="ts">
  import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
  } from 'radix-vue'
  
  import { reactive } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  
  interface FilterData {
    nim: string
    namaMahasiswa: string
    idBuku: string
    namaBuku: string
    tanggalPinjam: string
    tanggalKembali: string
    lamaPinjam: number | null
  }
  
  const filters = reactive<FilterData>({
    nim: '',
    namaMahasiswa: '',
    idBuku: '',
    namaBuku: '',
    tanggalPinjam: '',
    tanggalKembali: '',
    lamaPinjam: null,
  })
  
  const router = useRouter()
  const route = useRoute()
  
  const submitFilter = () => {
    const params = new URLSearchParams()
  
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null) {
        params.set(key, String(value))
      }
    })
  
    router.push({ path: route.path, query: Object.fromEntries(params.entries()) })
  }
  
  const resetFilter = () => {
    filters.nim = ''
    filters.namaMahasiswa = ''
    filters.idBuku = ''
    filters.namaBuku = ''
    filters.tanggalPinjam = ''
    filters.tanggalKembali = ''
    filters.lamaPinjam = null
  }
  </script>
  
  