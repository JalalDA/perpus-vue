<script setup lang="ts">
const apiUrl = import.meta.env.VITE_API_URL;
import { onMounted, ref } from 'vue';
import axios from 'axios';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from 'radix-vue';
import BukuTable from '../components/table/buku-table.vue';


type Rak = {
    id: string,
    namaRak: string,
    lokasi: string,
}


const judul = ref('');
const penerbit = ref('');
const tahunTerbit = ref('');
const penulis = ref('');
const stok = ref('');
const isLoading = ref(false);
const successMessage = ref('');
const rak = ref<Rak[]>([])
const selectedRak = ref('')

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

const handleSubmit = async () => {
    isLoading.value = true;
    successMessage.value = '';
    try {
        const response = await axios.post(`${apiUrl}/api/buku`, {
            judul: judul.value,
            penerbit: penerbit.value,
            tahunTerbit : tahunTerbit.value,
            penulis : penulis.value,
            rakId : selectedRak.value,
            stok : stok.value
        });
        if (response.status === 201) {
            window.location.reload();
        } else {
            console.error('Error submitting data:', response.statusText);
        }
        console.log({
            judul: judul.value,
            penerbit: penerbit.value,
            tahunTerbit: tahunTerbit.value,
            penulis: penulis.value,
            rakId: selectedRak.value,
            stok: stok.value
        });
        
        successMessage.value = 'Data berhasil disubmit!';
        isLoading.value = false;
    } catch (error) {
        console.error('Error submitting data:', error);
        isLoading.value = false;
    }
}

onMounted(() => {
    fetchRak();
})
</script>

<template>
    <DialogRoot>
        <DialogTrigger
            class="text-grass11 font-semibold mt-4 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] leading-none focus:outline-none">
            Tambah Buku
        </DialogTrigger>
        <DialogPortal>
            <DialogOverlay
                className="bg-black/50 data-[state=open]:animate-fadeIn fixed inset-0 z-30 backdrop-blur-sm" />
            <DialogContent
                class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]">
                <DialogTitle class="text-mauve12 m-0 text-[17px] font-semibold">
                    Tambah Buku
                </DialogTitle>
                <DialogDescription class="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                    Masukan data buku
                </DialogDescription>
                <fieldset class="mb-[15px] flex items-center gap-5">
                    <label class="text-grass11 w-[90px] text-right text-[15px]" for="judul"> Judul </label>
                    <input id="judul" v-model="judul"
                        class="text-grass11 shadow-green7 focus:shadow-green8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        placeholder="Judul Buku">
                </fieldset>
                <fieldset class="mb-[15px] flex items-center gap-5">
                    <label class="text-grass11 w-[90px] text-right text-[15px]" for="selectedRak">Pilih Rak </label>
                    <select v-model="selectedRak"
                        class="w-[75%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200">
                        <option v-for="rk in rak" :key="rk.id" :value="rk.id">
                            {{ rk.namaRak }}
                        </option>
                    </select>
                </fieldset>
                <fieldset class="mb-[15px] flex items-center gap-5">
                    <label class="text-grass11 w-[90px] text-right text-[15px]" for="penulis">Penulis </label>
                    <input id="penulis" v-model="penulis"
                        class="text-grass11 shadow-green7 focus:shadow-green8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        placeholder="Penulis">
                </fieldset>
                <fieldset class="mb-[15px] flex items-center gap-5">
                    <label class="text-grass11 w-[90px] text-right text-[15px]" for="penerbit">Penerbit</label>
                    <input id="penerbit" v-model="penerbit"
                        class="text-grass11 shadow-green7 focus:shadow-green8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        placeholder="Penerbit">
                </fieldset>
                <fieldset class="mb-[15px] flex items-center gap-5">
                    <label class="text-grass11 w-[90px] text-right text-[15px]" for="tahunTerbit">Tahun Terbit</label>
                    <input id="tahunTerbit" v-model="tahunTerbit"
                        type="number"
                        class="text-grass11 shadow-green7 focus:shadow-green8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        placeholder="Tahun Terbit">
                </fieldset>
                <fieldset class="mb-[15px] flex items-center gap-5">
                    <label class="text-grass11 w-[90px] text-right text-[15px]" for="stok">Stok</label>
                    <input id="stok" v-model="stok"
                        type="number"
                        class="text-grass11 shadow-green7 focus:shadow-green8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        placeholder="Stok">
                </fieldset>
                <div v-if="successMessage" class="text-center text-green-500">{{ successMessage }}</div>
                <div class="mt-[25px] flex gap-x-8 justify-end">
                    <DialogClose as-child>
                        <button
                            class="bg-red-500 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                            Cancel
                        </button>
                    </DialogClose>

                    <button type="button" @click="handleSubmit"
                        class="bg-red-500 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                        {{ isLoading ? 'Loading...' : 'Submit' }}
                    </button>
                </div>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
    <BukuTable />
</template>