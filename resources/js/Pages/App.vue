<script setup>
import { Head, Link } from '@inertiajs/vue3';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { CustomerService } from '@/Service/CustomerService';

import { useToast } from "primevue/usetoast";
const toast = useToast();

import { ref, onMounted } from 'vue';

const customers = ref();

const show = () => {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 2000 });
};

onMounted(() => {
    CustomerService.getCustomersMedium().then((data) => (customers.value = data));
});


</script>

<template>

    <Head title="CRUD" />

    <div class="p-5">
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