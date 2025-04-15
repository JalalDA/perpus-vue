<script setup lang="ts">
const apiUrl = import.meta.env.VITE_API_URL;
import { ref } from 'vue';
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
import MahasiswaTable from '../components/table/mahasiswa-table.vue';

const nama = ref('');
const nim = ref('');
const jurusan = ref('');
const isLoading = ref(false); 
const successMessage = ref(''); 

const handleSubmit = async () => {
    isLoading.value = true;
    successMessage.value = ''; 
    try {
        const response = await axios.post(`${apiUrl}/api/mahasiswa`, {
            nama: nama.value,
            nim: nim.value,
            jurusan: jurusan.value
        });
        if(response.status === 201) {
          window.location.reload();
        } else {
            console.error('Error submitting data:', response.statusText);
        }
        successMessage.value = 'Data berhasil disubmit!'; 
        isLoading.value = false;
    } catch (error) {
        console.error('Error submitting data:', error);
        isLoading.value = false;
    }
};</script>

<template>
    <DialogRoot>
        <DialogTrigger
            class="text-grass11 font-semibold mt-4 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] leading-none focus:outline-none">
            Tambah
        </DialogTrigger>
        <DialogPortal>
            <DialogOverlay
                className="bg-black/50 data-[state=open]:animate-fadeIn fixed inset-0 z-30 backdrop-blur-sm" />
            <DialogContent
                class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]">
                <DialogTitle class="text-mauve12 m-0 text-[17px] font-semibold">
                    Tambah Mahasiswa
                </DialogTitle>
                <DialogDescription class="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                    Masukan data mahasiswa
                </DialogDescription>
                <fieldset class="mb-[15px] flex items-center gap-5">
                    <label class="text-grass11 w-[90px] text-right text-[15px]" for="name"> Nama </label>
                    <input id="name" v-model="nama"
                        class="text-grass11 shadow-green7 focus:shadow-green8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        placeholder="Enter Nama">
                </fieldset>
                <fieldset class="mb-[15px] flex items-center gap-5">
                    <label class="text-grass11 w-[90px] text-right text-[15px]" for="nim">NIM </label>
                    <input id="nim" v-model="nim"
                        class="text-grass11 shadow-green7 focus:shadow-green8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        placeholder="Enter NIM">
                </fieldset>
                <fieldset class="mb-[15px] flex items-center gap-5">
                    <label class="text-grass11 w-[90px] text-right text-[15px]" for="jurusan"> Jurusan </label>
                    <input id="jurusan" v-model="jurusan"
                        class="text-grass11 shadow-green7 focus:shadow-green8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        placeholder="Enter Jurusan">
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
    <MahasiswaTable />
</template>
