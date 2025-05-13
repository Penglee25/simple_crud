<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { useToast } from "primevue/usetoast";
import { CustomerService } from '@/Service/CustomerService';

const toast = useToast();

const onShowModal = ref(false);
const onModalText = ref("");


const show = () => {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 2000 });
};

const customers = ref();
onMounted(() => {
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
                <div class="flex flex-col gap-3">
                    <div class="flex flex-col gap-1">
                        <label for="name" class="font-semibold w-24">Name</label>
                        <InputText id="name" class="flex-auto" autocomplete="off" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="email" class="font-semibold w-24">Email</label>
                        <InputText id="email" class="flex-auto" autocomplete="off" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="phone" class="font-semibold w-24">Phone</label>
                        <InputText id="phone" class="flex-auto" autocomplete="off" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="address" class="font-semibold w-24">Address</label>
                        <InputText id="address" class="flex-auto" autocomplete="off" />
                    </div>
                </div>
                <template #footer>
                    <Button label="Cancel" text severity="secondary" @click="onShowModal = false" autofocus />
                    <Button label="Save" severity="info" @click="onShowModal = false" autofocus />
                </template>
            </Dialog>
        </div>
    </div>

    <div class="p-5 mt-10">
        <DataTable :value="customers" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}">
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" text />
            </template>
            <template #paginatorend>
                <Button type="button" icon="pi pi-download" text />
            </template>
            <Column field="name" header="Name" style="width: 25%"></Column>
            <Column field="country.name" header="Country" style="width: 25%"></Column>
            <Column field="company" header="Company" style="width: 25%"></Column>
            <Column field="representative.name" header="Representative" style="width: 25%"></Column>
        </DataTable>
    </div>

    <!-- <Button label="Show" @click="show()" />
    <Toast /> -->
</template>