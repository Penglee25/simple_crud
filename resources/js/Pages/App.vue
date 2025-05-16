<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { ref, onMounted, toRaw } from 'vue';
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

const formValues = ref({
    id: null,
    name: '',
    email: '',
    phone: '',
    address: '',
});

const headers = [
    { text: "Name", value: "name" },
    { text: "Email", value: "email" },
    { text: "Phone", value: "phone", sortable: true },
    { text: "Address", value: "address", sortable: true },
    { text: "", value: "action", width: 30 },
];

const items = ref([]);

const onShowModalUpdate = (data) => {
    onShowModal.value = true;
    onModalText.value = 'Update User';
    formValues.value.id = data.id;
    formValues.value.name = data.name;
    formValues.value.email = data.email;
    formValues.value.phone = data.phone;
    formValues.value.address = data.address;
}

const onCancelModal = () => {
    onShowModal.value = false;
    formValues.value.id = null;
    formValues.value.name = '';
    formValues.value.email = '';
    formValues.value.phone = '';
    formValues.value.address = '';
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

    await submitActions({
        title: 'Submit Form?',
        text: 'Are you sure you want to submit?',
        icon: 'warning',
        axiosConfig: {
            method: 'post',
            url: 'api/userdetails/store',
            data: toRaw(formValues._value),
            headers: {
                'Content-Type': 'application/json'
            }
        },
        onBefore: () => {
            showLoader('Please wait...');
        },
        onSuccess: (response) => {
            fetchData();
            onShowModal.value = false;
            formValues.value.name = '';
            formValues.value.email = '';
            formValues.value.phone = '';
            formValues.value.address = '';
        },
        onError: (error) => {
            hideLoader();
            console.error('Error occurred:', error);
        }
    });

}


const onFormUpdate = async (form) => {

    const plainValues = toRaw(form._value)

    await submitActions({
        title: "Are you sure?",
        text: "Update User?",
        icon: 'info',
        axiosConfig: {
            method: 'put',
            url: 'api/userdetails/update/' + form._value.id,
            data: plainValues,
            headers: {
                'Content-Type': 'application/json'
            }
        },
        onBefore: () => {
            showLoader('Updating...');
        },
        onSuccess: (response) => {
            fetchData();
            onShowModal.value = false;
            onModalText.value = '';
            formValues.value.name = '';
            formValues.value.email = '';
            formValues.value.phone = '';
            formValues.value.address = '';
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