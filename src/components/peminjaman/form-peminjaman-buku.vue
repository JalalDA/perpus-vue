<template>
    <div class="px-8 py-6 w-screen">
        <div class="text-2xl font-bold text-center mb-8">📚 Form Peminjaman Buku</div>
        <div class="flex md:flex-row flex-col items-start justify-between gap-x-4">
            <div class="w-1/2">
                <h2 class="text-xl font-semibold mb-4">Pilih Buku</h2>
                <input v-model="search" type="text" placeholder="Cari nama Buku..."
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 mb-4" />
                <div class="flex items-center gap-x-4 mb-4">
                    <select v-model="selectedRak"
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200">
                        <option value="">Semua rak</option>
                        <option v-for="rk in rak" :key="rk.id" :value="rk.id">
                            {{ rk.namaRak }}
                        </option>
                    </select>
                </div>
                <div class="grid grid-cols-3 gap-4 w-full">
                    <div v-for="book in buku" :key="book.id" @click="selectBook(book)"
                        class="p-4 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg">
                        <div class="font-semibold text-start">📖 Judul: {{ book.judul }}</div>
                        <div class="text-start">✍️ Penulis: {{ book.penulis }}</div>
                        <div class="text-start">🏢 Penerbit: {{ book.penerbit }}</div>
                        <div class="text-start">📅 Tahun: {{ book.tahunTerbit }}</div>
                        <div class="text-start">📦 Stok: {{ book.stok }}</div>
                    </div>
                </div>

                <div class="flex justify-between items-center pt-4">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="px-3 py-1 rounded disabled:opacity-50">Prev</button>
                    <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-3 py-1 rounded disabled:opacity-50">Next</button>
                </div>
            </div>

            <div class="w-1/2">
                <h2 class="text-xl font-semibold mb-4">Lengkapi Data Peminjaman</h2>
                <div class="bg-white p-6 rounded-xl shadow-md">
                    <div class="mb-4">
                        <label for="nama" class="block font-medium mb-1">Nama Mahasiswa</label>
                        <select v-model="selectedMahasiswa"
                            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200">
                            <option v-for="mhs in mahasiswa" :key="mhs.id" :value="mhs.id">
                                {{ mhs.nama }}
                            </option>
                        </select>
                    </div>
                    <button @click="peminjamanAction" :disabled="!selectedMahasiswa || !selectedBook.length">Pinjam
                        Sekarang</button>
                </div>

                <!-- Keranjang -->
                <div v-if="selectedBook.length > 0" class="mt-6">
                    <h2 class="text-xl font-semibold mb-4">🛒 Keranjang Buku</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div v-for="book in selectedBook" :key="book.id"
                            class="p-4 bg-gray-100 rounded-xl shadow-sm relative">
                            <div class="font-semibold text-start">📖 Judul: {{ book.judul }}</div>
                            <div class="text-start">✍️ Penulis: {{ book.penulis }}</div>
                            <div class="text-start">🏢 Penerbit: {{ book.penerbit }}</div>
                            <div class="text-start">📅 Tahun: {{ book.tahunTerbit }}</div>
                            <button @click="deselectBook(book)"
                                class=" right-2 text-sm bg-red-500 mt-4 px-2 py-1 rounded hover:bg-red-600 transition">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
const apiUrl = import.meta.env.VITE_API_URL;
import axios from 'axios'
import { ref, watch, onMounted, computed } from 'vue'
import type { Mahasiswa } from '../table/mahasiswa-table.vue'

type Buku = {
    id: string
    judul: string
    penerbit: string
    tahunTerbit: number
    penulis: string
    rakId: string
    rak: {
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
const selectedBook = ref<Buku[]>([])
const mahasiswa = ref<Mahasiswa[]>([])
const selectedMahasiswa = ref("")

const limit = 10
const totalPages = computed(() => Math.ceil(totalData.value / limit))

const selectBook = (item: Buku) => {
    const alreadySelected = selectedBook.value.find(book => book.id === item.id)
    if (alreadySelected) {
        return alert("Buku ini sudah ada di keranjang")
    }
    selectedBook.value.push(item)
}

const deselectBook = (item: Buku) => {
    const filteredBook = selectedBook.value.filter(book => book.id !== item.id)
    selectedBook.value = filteredBook
}

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
        console.log({ response });

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

async function fetchMahasiswa() {
    loading.value = true
    try {
        const searchParams = new URLSearchParams()
        if (search.value) searchParams.set('search', search.value)
        searchParams.set('page', currentPage.value.toString())
        searchParams.set('limit', limit.toString())

        const response = await axios.get(`${apiUrl}/api/mahasiswa?${searchParams.toString()}`)

        if (response.status === 200) {
            mahasiswa.value = response.data?.data || []
        }
    } catch (error) {
        console.error('Error fetching data:', error)
        errorMessage.value = 'Terjadi kesalahan saat mengambil data.'
    } finally {
        loading.value = false
    }
}

async function peminjamanAction() {
    try {
        if (!selectedMahasiswa.value) {
            alert("Pilih mahasiswa terlebih dahulu")
            return
        }
        if (selectedBook.value.length === 0) {
            alert("Pilih buku terlebih dahulu")
            return
        }

        const response = await axios.post(`${apiUrl}/api/peminjaman`, {
            mahasiswaId: selectedMahasiswa.value,
            bukuIds: selectedBook.value.map(book => book.id),
        })
        console.log({ response });
        if (response.status === 201) {
            alert('Peminjaman berhasil')
            selectedBook.value = []
            selectedMahasiswa.value = ""
        }
    } catch (error) {
        console.error('Error fetching data:', error)
        errorMessage.value = 'Terjadi kesalahan saat mengambil data.'
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
onMounted(fetchMahasiswa)

</script>