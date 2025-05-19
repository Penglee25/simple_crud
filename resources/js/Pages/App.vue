<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ref, onMounted, toRaw, watch } from 'vue';
import axios from "axios";

import Modal from '@/Components/Modal.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import InputLabel from '@/Components/InputLabel.vue';

import "vue3-easy-data-table/dist/style.css";
import Vue3EasyDataTable from "vue3-easy-data-table";


import { submitActions, showLoader, hideLoader } from '@/Utils/toastApiWrapper';

const onShowModal = ref(false);
const onModalText = ref("");

const formValues = useForm({
    id: null,
    photo: null,
    name: '',
    email: '',
    phone: '',
    address: '',
});

const previewImg = ref(null);

const headers = [
    { text: "Name", value: "name" },
    { text: "Email", value: "email" },
    { text: "Phone", value: "phone", sortable: true },
    { text: "Address", value: "address", sortable: true },
    { text: "Pic", value: "photo" },
    { text: "", value: "action", width: 30 },
];

const items = ref([]);

const onShowModalUpdate = (data) => {
    onShowModal.value = true;
    onModalText.value = 'Update User';

    previewImg.value = data.photo
        ? `${import.meta.env.VITE_USER_FILE}${data.photo}`
        : null;

    formValues.id = data.id;
    formValues.name = data.name;
    formValues.photo = data.photo;
    formValues.email = data.email;
    formValues.phone = data.phone;
    formValues.address = data.address;
    console.log(formValues);

}

const onCancelModal = () => {
    onShowModal.value = false;
    formValues.reset();
    previewImg.value = null;
}

const fetchData = async () => {

    try {
        const response = await axios.get('api/userdetails/fetch');
        items.value = response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

const onFormSubmit = () => {

    if (onModalText.value === 'Create User') {
        onFormCreate();
    }

    if (onModalText.value === 'Update User') {
        onFormUpdate(formValues);
    }

}

const onFormCreate = async () => {

    const formData = new FormData();
    formData.append('id', null);
    formData.append('name', formValues.name);
    formData.append('email', formValues.email);
    formData.append('phone', formValues.phone);
    formData.append('address', formValues.address);
    if (formValues.photo) {
        formData.append('photo', formValues.photo);
    }

    await submitActions({
        title: 'Submit Form?',
        text: 'Are you sure you want to submit?',
        icon: 'warning',
        axiosConfig: {
            method: 'post',
            headers: { "Content-Type": "multipart/form-data" },
            url: 'api/userdetails/store',
            data: formData,
        },
        onBefore: () => {
            showLoader('Please wait...');
        },
        onSuccess: (response) => {
            fetchData();
            onShowModal.value = false;
            formValues.reset();
            previewImg.value = null;
        },
        onError: (error) => {
            hideLoader();
            console.error('Error occurred:', error);
        }
    });

}


const onFormUpdate = async (form) => {

    const formData = new FormData();
    formData.append('id', formValues.id);
    formData.append('name', formValues.name);
    formData.append('email', formValues.email);
    formData.append('phone', formValues.phone);
    formData.append('address', formValues.address);
    if (formValues.photo) {
        formData.append('photo', formValues.photo);
    }

    formData.append('_method', 'PUT');

    await submitActions({
        title: "Are you sure?",
        text: "Update User?",
        icon: 'info',
        axiosConfig: {
            method: 'post',
            url: 'api/userdetails/update/' + formValues.id,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        },
        onBefore: () => {
            showLoader('Updating...');
        },
        onSuccess: (response) => {
            fetchData();
            onShowModal.value = false;
            onModalText.value = '';
            formValues.reset();
            previewImg.value = null;
        },
        onError: (error) => {
            hideLoader();
            console.error('Error occurred:', error);
        }
    });

}

const onDelete = async (id) => {
    await submitActions({
        title: "Are you sure you want to delete?",
        text: "This can\'t be undone!",
        icon: "warning",
        axiosConfig: {
            method: 'delete',
            url: 'api/userdetails/destroy/' + id,
        },
        onBefore: () => {
            showLoader('Deleting...');
        },
        onSuccess: (response) => {
            fetchData();
        },
        onError: (error) => {
            hideLoader();
            console.error('Error occurred:', error);
        }
    });
}

const loadFile = (event) => {

    const file = event.target.files[0];
    if (file) {
        formValues.photo = file;
        previewImg.value = URL.createObjectURL(file);
    } else {
        formValues.photo = null;
        previewImg.value = null;
        console.log('No file selected');
    }
};


onMounted(() => {
    fetchData();
});


</script>

<template>

    <Head title="CRUD" />
    <div class="text-center mt-10">
        <PrimaryButton label="Create User" @click="onShowModal = true; onModalText = 'Create User'">
            Create User
        </PrimaryButton>

        <Modal :show="onShowModal">
            <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900">
                    {{ onModalText }}
                </h2>

                <hr class="my-3" />

                <form @submit.prevent="onFormSubmit">

                    <div class="flex items-center justify-center space-x-6">
                        <div class="shrink-0">
                            <img id='preview_img' class="h-16 w-16 object-cover rounded-full border"
                                :src="previewImg ? previewImg : 'https://lh3.googleusercontent.com/a-/AFdZucpC_6WFBIfaAbPHBwGM9z8SxyM1oV4wB4Ngwp_UyQ=s96-c'"
                                alt="Current profile photo" />
                        </div>
                        <div class="flex flex-col">
                            <span class="sr-only">Choose profile photo</span>
                            <input type="file" @change="loadFile" accept="image/jpeg,image/png,image/bmp" class="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-violet-700
                                hover:file:bg-violet-100" />
                        </div>
                    </div>


                    <div class="flex flex-col gap-3">
                        <div class="relative">
                            <InputLabel for="name" value="Name" required />
                            <TextInput v-model="formValues.name" type="text" id="name" class="w-full mt-1" required />
                        </div>

                        <div class="relative">
                            <InputLabel for="email" value="Email" required />
                            <TextInput v-model="formValues.email" type="text" id="email" class="w-full mt-1" required />
                        </div>

                        <div class="relative">
                            <InputLabel for="phone" value="Phone" required />
                            <TextInput v-model="formValues.phone" type="text" id="phone" class="w-full mt-1" required />
                        </div>

                        <div class="relative">
                            <InputLabel for="address" value="Address" required />
                            <TextInput v-model="formValues.address" type="text" id="address" class="w-full mt-1"
                                required />
                        </div>
                    </div>


                    <div class="mt-6 flex justify-end">
                        <SecondaryButton @click="onCancelModal">
                            Cancel
                        </SecondaryButton>
                        <button type="submit"
                            class="bg-indigo-500 text-white rounded-lg px-3 py-1 ml-2 hover:bg-indigo-700 transition ease-in-out duration-150">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </Modal>

    </div>

    <div class="p-10">
        <Vue3EasyDataTable :headers="headers" :items="items" alternating table-class-name="customize-table"
            class="cursor-pointer">

            <template #item-photo="item">
                <img id='preview_img' class="h-16 w-16 object-cover rounded-full border"
                    :src="item.photo ? 'storage/'+item.photo : 'https://lh3.googleusercontent.com/a-/AFdZucpC_6WFBIfaAbPHBwGM9z8SxyM1oV4wB4Ngwp_UyQ=s96-c'"
                    alt="Current profile photo" />

            </template>
            <template #item-action="item">
                <div class="flex gap-1 p-2">
                    <button @click="onShowModalUpdate(item)"
                        class="bg-indigo-500 text-white rounded-lg px-3 py-1 ml-2 hover:bg-indigo-700 transition ease-in-out duration-150">
                        Update
                    </button>
                    <button @click="onDelete(item.id)"
                        class="bg-red-500 text-white rounded-lg px-3 py-1 ml-2 hover:bg-red-700 transition ease-in-out duration-150">
                        Delete
                    </button>
                </div>
            </template>
        </Vue3EasyDataTable>
    </div>
</template>