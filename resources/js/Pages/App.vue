<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { ref, onMounted, toRaw } from 'vue';
import axios from "axios";

import Modal from '@/Components/Modal.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import InputLabel from '@/Components/InputLabel.vue';

// import 'primeicons/primeicons.css'

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { Form } from '@primevue/forms';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { submitActions, showLoader, hideLoader } from '@/Utils/toastApiWrapper';

const onShowModal = ref(false);
const onModalText = ref("");
const onLoadingSubmit = ref(false);
const userCollection = ref([]);

const formValues = ref({
    id: null,
    name: '',
    email: '',
    phone: '',
    address: '',
});

const validation = ({ values }) => {
    const errors = {
        name: [],
        email: [],
        phone: [],
        address: [],
    };

    if (!values.name) {
        errors.name.push({ type: 'required', message: 'name is required.' });
    }

    if (!values.email) {
        errors.email.push({ type: 'required', message: 'email is required.' });
    }

    if (!values.phone) {
        errors.phone.push({ type: 'required', message: 'phone is required.' });
    }

    if (!values.address) {
        errors.address.push({ type: 'required', message: 'address is required.' });
    }

    return {
        values,
        errors
    };
};

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
        userCollection.value = response.data;
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
    console.log('sdasdddd App.vue page mounted');
     fetchData();
});

</script>

<template>

    <!-- <Head title="CRUD" /> -->
    TANGINA MO
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

        <!-- <div class="card flex justify-center">
            <Dialog v-model:visible="onShowModal" modal header="Edit Profile" :style="{ width: '25rem' }">
                <template #header>
                    <div class="inline-flex items-center justify-center gap-2">
                        <span class="font-bold whitespace-nowrap">{{ onModalText }}</span>
                    </div>
                </template>


<Form v-slot="$form" :formValues :resolver="validation" @submit="onFormSubmit">
    <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
            <label for="name" class="font-semibold w-24">Name</label>
            <InputText v-model="formValues.name" id="name"
                :name="onModalText === 'Update User' ? (!formValues.name ? 'name' : formValues.name) : 'name'"
                class="flex-auto" autocomplete="off" />
            <span class="text-red-500">{{ $form.name?.error?.message }}</span>
        </div>
        <div class="flex flex-col gap-1">
            <label for="email" class="font-semibold w-24">Email</label>
            <InputText v-model="formValues.email" id="email"
                :name="onModalText === 'Update User' ? (!formValues.email ? 'email' : formValues.email) : 'email'"
                class="flex-auto" autocomplete="off" />
            <span class="text-red-500">{{ $form.email?.error?.message }}</span>
        </div>
        <div class="flex flex-col gap-1">
            <label for="phone" class="font-semibold w-24">Phone</label>
            <InputText v-model="formValues.phone" id="phone"
                :name="onModalText === 'Update User' ? (!formValues.phone ? 'phone' : formValues.phone) : 'phone'"
                class="flex-auto" autocomplete="off" />
            <span class="text-red-500">{{ $form.phone?.error?.message }}</span>
        </div>
        <div class="flex flex-col gap-1">
            <label for="address" class="font-semibold w-24">Address</label>
            <InputText v-model="formValues.address" id="address"
                :name="onModalText === 'Update User' ? (!formValues.address ? 'address' : formValues.address) : 'address'"
                class="flex-auto" autocomplete="off" />
            <span class="text-red-500">{{ $form.address?.error?.message }}</span>
        </div>
    </div>

    <div class="flex justify-end mt-5">
        <Button label="Cancel" text severity="secondary" @click="onCancelModal()" autofocus />
        <Button type="submit" :label="onModalText === 'Update User' ? 'Update' : 'Save'" :loading="onLoadingSubmit"
            severity="info" autofocus />
    </div>
</Form>


</Dialog>
</div> -->
    </div>

    <!-- <div class="p-5 mt-10 text-center">
        <DataTable :value="userCollection" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}">
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" text />
            </template>
            <Column field="name" header="Name" style="width: 25%"></Column>
            <Column field="email" header="Email" style="width: 25%"></Column>
            <Column field="phone" header="Phone" style="width: 25%"></Column>
            <Column field="address" header="Address" style="width: 25%"></Column>
            <Column style="width: auto">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pen-to-square" @click="onShowModalUpdate(data)" severity="info"
                            rounded></Button>
                        <Button icon="pi pi-trash" @click="onDelete(data.id)" severity="danger" rounded></Button>
                    </div>
                </template>
            </Column>

            <template #empty> 
                <span >No Users found.</span>
            </template>
        </DataTable>
    </div> -->


</template>