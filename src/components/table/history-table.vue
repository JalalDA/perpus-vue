<template>
    <div class="p-6 bg-white h-full w-full rounded-xl shadow space-y-4 md:w-[800px] my-4">
        <h2 class="text-xl font-semibold">Data Peminjaman Buku</h2>
        <input v-model="search" type="text" placeholder="Cari nama mahasiswa..."
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200" />
        <FilterForm/>
        <div class="overflow-auto">
            <table class="w-full mt-4 border text-sm">
                <thead class="bg-gray-100 text-left">
                    <tr>
                        <th class="p-3 border-b border">Judul Buku</th>
                        <th class="p-3 border-b border">Nama Mahasiswa</th>
                        <th class="p-3 border-b border">Tanggal Pinjam</th>
                        <th class="p-3 border-b border">Tanggal Pengembalian</th>
                        <th class="p-3 border-b border">Lama Pinjam</th>
                        <th class="p-3 border-b border">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td colspan="3" class="text-center p-4 text-gray-500">Memuat data...</td>
                    </tr>
                    <tr v-else-if="dataPeminjaman.length === 0">
                        <td colspan="3" class="text-center p-4 text-gray-500">Tidak ada data.</td>
                    </tr>
                    <tr v-if="dataPeminjaman.length !== 0" v-for="hstry in dataPeminjaman" :key="hstry.idBuku" class="hover:bg-gray-50">
                        <td class="p-3 border-b border">{{ hstry.namaBuku }}</td>
                        <td class="p-3 border-b border">{{ hstry.namaMahasiswa }}</td>
                        <td class="p-3 border-b border">{{ hstry.tanggalPinjam.toString() }}</td>
                        <td class="p-3 border-b border">{{ hstry.tanggalKembali }}</td>
                        <td class="p-3 border-b border">{{ hstry.lamaPinjam }} Hari</td>
                        <td class="p-3 border-b border">{{ hstry.status }}</td>
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
import moment from 'moment'
import FilterForm from '../history/filter-form.vue'

export type History = {
    nim: string,
    namaMahasiswa: string,
    idBuku: string,
    namaBuku: string,
    tanggalPinjam: string
    tanggalKembali: string,
    lamaPinjam: number,
    status: string,
    tanggalStatus: string
}

const dataPeminjaman = ref<History[]>([])
const search = ref('')
const currentPage = ref(1)
const totalData = ref(0)
const loading = ref(false)
const errorMessage = ref('')

const limit = 10
const totalPages = computed(() => Math.ceil(totalData.value / limit))

async function fetchHistory() {
    loading.value = true
    try {
        const searchParams = new URLSearchParams()
        if (search.value) searchParams.set('search', search.value)
        searchParams.set('page', currentPage.value.toString())
        searchParams.set('limit', limit.toString())

        const response = await axios.get(`${apiUrl}/api/history?${searchParams.toString()}`)
        console.log({ response });


        if (response.status === 200) {
            const formattedData = (response.data?.data || []).map((item:History) => ({
                ...item,
                tanggalPinjam: moment(item.tanggalPinjam).format('D MMMM YYYY'),
                tanggalKembali: moment(item.tanggalKembali).format('D MMMM YYYY'),
            }))
            dataPeminjaman.value = formattedData|| []
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

watch([search, currentPage], () => {
    fetchHistory()
})

onMounted(fetchHistory)

</script>