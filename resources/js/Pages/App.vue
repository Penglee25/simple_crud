<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { ref, onMounted, toRaw } from 'vue';
import { useForm } from '@inertiajs/vue3';

import 'primeicons/primeicons.css'

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
// import Card from 'primevue/card';
import { Form } from '@primevue/forms';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { useToast } from "primevue/usetoast";
import { submitActions, showLoader, hideLoader } from '@/Utils/toastApiWrapper';
import { CustomerService } from '@/Service/CustomerService';

const toast = useToast();

const onShowModal = ref(false);
const onModalText = ref("");
const onLoadingSubmit = ref(false);
const userCollection = ref([]);

const formValues = ref({
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

const fetchData = async () => {

    try {
        const response = await axios.get('api/userdetails/fetch');
        userCollection.value = response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

const onFormSubmit = async ({ valid }) => {
    onLoadingSubmit.value = true;
    if (valid) {
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
                onLoadingSubmit.value = false;
                formValues.name = '';
                formValues.email = '';
                formValues.phone = '';
                formValues.address = '';
            },
            onError: (error) => {
                hideLoader();
                console.error('Error occurred:', error);
                onLoadingSubmit.value = false;
            }
        });

    }
}

const onDelete = async (id) => {
    console.log(id);
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



const customers = ref();
onMounted(() => {
    fetchData();
    CustomerService.getCustomersMedium().then((data) => (customers.value = data));
});

</script>

<template>

    <Head title="CRUD" />

    <div class="text-center mt-10">
        <Button label="Create User" @click="onShowModal = true; onModalText = 'Create User'" />
        <div class="card flex justify-center">
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
                            <InputText v-model="formValues.name" id="name" name="name" class="flex-auto"
                                autocomplete="off" />
                            <span class="text-red-500">{{ $form.name?.error?.message }}</span>
                        </div>
                        <div class="flex flex-col gap-1">
                            <label for="email" class="font-semibold w-24">Email</label>
                            <InputText v-model="formValues.email" id="email" name="email" class="flex-auto"
                                autocomplete="off" />
                            <span class="text-red-500">{{ $form.email?.error?.message }}</span>
                        </div>
                        <div class="flex flex-col gap-1">
                            <label for="phone" class="font-semibold w-24">Phone</label>
                            <InputText v-model="formValues.phone" id="phone" name="phone" class="flex-auto"
                                autocomplete="off" />
                            <span class="text-red-500">{{ $form.phone?.error?.message }}</span>
                        </div>
                        <div class="flex flex-col gap-1">
                            <label for="address" class="font-semibold w-24">Address</label>
                            <InputText v-model="formValues.address" id="address" name="address" class="flex-auto"
                                autocomplete="off" />
                            <span class="text-red-500">{{ $form.address?.error?.message }}</span>
                        </div>
                    </div>

                    <div class="flex justify-end mt-5">
                        <Button label="Cancel" text severity="secondary" @click="onShowModal = false" autofocus />
                        <Button type="submit" label="Save" :loading="onLoadingSubmit" severity="info" autofocus />
                    </div>
                </Form>


            </Dialog>
        </div>
    </div>

    <div class="p-5 mt-10">
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
                        <Button icon="pi pi-pen-to-square" @click="() => { }" severity="secondary" rounded></Button>
                        <Button icon="pi pi-trash" @click="onDelete(data.id)" severity="secondary" rounded></Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>

    <!-- <Button label="Show" @click="show()" />
    <Toast /> -->
</template>