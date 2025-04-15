<template>
    <div class="p-6 bg-white rounded-xl shadow space-y-4 md:w-[800px] my-4">
        <h2 class="text-xl font-semibold">Data Buku</h2>
        <input v-model="search" type="text" placeholder="Cari nama Buku..."
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200" />
        <div class="flex items-center gap-x-4">
            <select v-model="selectedRak"
                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200">
                <option value="">Semua rak</option>
                <option v-for="rk in rak" :key="rk.id" :value="rk.id">
                    {{ rk.namaRak }}
                </option>
            </select>
            <button>Tambah</button>
        </div>

        <div class="overflow-auto">
            <table class="w-full mt-4 border text-sm">
                <thead class="bg-gray-100 text-left">
                    <tr>
                        <th class="p-3 border-b border">Judul</th>
                        <th class="p-3 border-b border">Penerbit</th>
                        <th class="p-3 border-b border">Penulis</th>
                        <th class="p-3 border-b border">Tahun Terbit</th>
                        <th class="p-3 border-b border">Stok</th>
                        <th class="p-3 border-b border">Rak</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td colspan="3" class="text-center p-4 text-gray-500">Memuat data...</td>
                    </tr>
                    <tr v-else-if="buku.length === 0">
                        <td colspan="3" class="text-center p-4 text-gray-500">Tidak ada data.</td>
                    </tr>
                    <tr v-for="book in buku" :key="book.id" class="hover:bg-gray-50">
                        <td class="p-3 border-b border">{{ book.judul }}</td>
                        <td class="p-3 border-b border">{{ book.penerbit }}</td>
                        <td class="p-3 border-b border">{{ book.penulis }}</td>
                        <td class="p-3 border-b border">{{ book.tahunTerbit }}</td>
                        <td class="p-3 border-b border">{{ book.stok }}</td>
                        <td class="p-3 border-b border">{{ book.rak.namaRak }} - {{ book.rak.lokasi }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex justify-between items-center pt-4">
            <button @click="prevPage" :disabled="currentPage === 1"
                class="px-3 py-1 rounded disabled:opacity-50">Prev</button>
            <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded disabled:opacity-50">Next</button>
        </div>
    </div>
</template>

<script setup lang="ts">
const apiUrl = import.meta.env.VITE_API_URL;
import axios from 'axios'
import { ref, watch, onMounted, computed } from 'vue'

type Buku = {
    id: string
    judul: string
    penerbit: string
    tahunTerbit: number
    penulis: string
    rakId: string
    rak : {
        namaRak: string
        lokasi: string
    }
    stok: number
}

type Rak = {
    id: string,
    namaRak: string,
    lokasi: string,
}

const buku = ref<Buku[]>([])
const search = ref('')
const selectedRak = ref('')
const currentPage = ref(1)
const totalData = ref(0)
const loading = ref(false)
const errorMessage = ref('')
const rak = ref<Rak[]>([])

const limit = 10
const totalPages = computed(() => Math.ceil(totalData.value / limit))

async function fetchRak() {
    try {
        const response = await axios.get(`${apiUrl}/api/rak`)
        if (response.status === 200) {
            rak.value = response.data?.data || []
        }
        console.log({ response });
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

async function fetchBuku() {
    loading.value = true
    try {
        const searchParams = new URLSearchParams()
        if (search.value) searchParams.set('search', search.value)
        if (selectedRak.value) searchParams.set('rakId', selectedRak.value)
        searchParams.set('page', currentPage.value.toString())
        searchParams.set('limit', limit.toString())

        const response = await axios.get(`${apiUrl}/api/buku?${searchParams.toString()}`)
        console.log({    response });
        
        if (response.status === 200) {
            buku.value = response.data?.data || []
            totalData.value = response.data?.total || 0
        }
    } catch (error) {
        console.error('Error fetching data:', error)
        errorMessage.value = 'Terjadi kesalahan saat mengambil data.'
    } finally {
        loading.value = false
    }
}

function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

watch([search, selectedRak, currentPage], () => {
    fetchBuku()
})

onMounted(fetchBuku)
onMounted(fetchRak)

</script>