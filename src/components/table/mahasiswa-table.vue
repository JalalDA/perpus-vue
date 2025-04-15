<template>
    <div class="p-6 bg-white h-full w-full rounded-xl shadow space-y-4 md:w-[800px] my-4">
        <h2 class="text-xl font-semibold">Data Mahasiswa</h2>
        <input v-model="search" type="text" placeholder="Cari nama mahasiswa..."
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200" />
        <select v-model="selectedJurusan"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200">
            <option value="">Semua Jurusan</option>
            <option value="Informatika">Informatika</option>
            <option value="Sistem Informasi">Sistem Informasi</option>
            <option value="Teknik Elektro">Teknik Elektro</option>
            <option value="Pertanian">Pertanian</option>
            <option value="Pendidikan">Pendidikan</option>
        </select>

        <div class="overflow-auto">
            <table class="w-full mt-4 border text-sm">
                <thead class="bg-gray-100 text-left">
                    <tr>
                        <th class="p-3 border-b border">NIM</th>
                        <th class="p-3 border-b border">Nama</th>
                        <th class="p-3 border-b border">Jurusan</th>
                        <th class="p-3 border-b border">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td colspan="3" class="text-center p-4 text-gray-500">Memuat data...</td>
                    </tr>
                    <tr v-else-if="mahasiswa.length === 0">
                        <td colspan="3" class="text-center p-4 text-gray-500">Tidak ada data.</td>
                    </tr>
                    <tr v-for="mhs in mahasiswa" :key="mhs.nim" class="hover:bg-gray-50">
                        <td class="p-3 border-b border">{{ mhs.nim }}</td>
                        <td class="p-3 border-b border">{{ mhs.nama }}</td>
                        <td class="p-3 border-b border">{{ mhs.jurusan }}</td>
                        <td v-if="mhs.isActive" class="p-3 border-b border">
                            <span class="text-green-500">Aktif</span>
                        </td>
                        <td v-else class="p-3 border-b border">
                            <span class="text-red-500">Tidak Aktif</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
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

export type Mahasiswa = {
    id: string
    nim: string
    nama: string
    jurusan: string
    isActive: boolean
}

const mahasiswa = ref<Mahasiswa[]>([])
const search = ref('')
const selectedJurusan = ref('')
const currentPage = ref(1)
const totalData = ref(0)
const loading = ref(false)
const errorMessage = ref('')

const limit = 10
const totalPages = computed(() => Math.ceil(totalData.value / limit))

async function fetchMahasiswa() {
    loading.value = true
    try {
        const searchParams = new URLSearchParams()
        if (search.value) searchParams.set('search', search.value)
        if (selectedJurusan.value) searchParams.set('jurusan', selectedJurusan.value)
        searchParams.set('page', currentPage.value.toString())
        searchParams.set('limit', limit.toString())

        const response = await axios.get(`${apiUrl}/api/mahasiswa?${searchParams.toString()}`)

        if (response.status === 200) {
            mahasiswa.value = response.data?.data || []
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

watch([search, selectedJurusan, currentPage], () => {
    fetchMahasiswa()
})

onMounted(fetchMahasiswa)

</script>