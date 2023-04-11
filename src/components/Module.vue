<template>
  <q-page class="q-pa-md">
    <div class="flex">
      <TaskCreate :page="page" />
    </div>
    <div v-if="loading">
      <p>Загрузка</p>
    </div>
    <div v-else class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="name" />
    </div>
  </q-page>
</template>

<script setup>
import { useQuery } from "@vue/apollo-composable";
import { getModuleById } from "src/graphql/queries";
import { onMounted, ref } from "vue";
import TaskCreate from "./TaskCreate.vue";

const { page } = defineProps({
  page: Object,
});

const rows = ref();

const {
  result: resultModule,
  refetch,
  loading,
  onResult,
} = useQuery(getModuleById, {
  module_id: page.page.object?.id,
});

onResult(() => {
  rows.value = resultModule?.value?.get_type1?.property4.map((el) => ({
    ...el,
    id: el.id,
  }));
});

const columns = [
  {
    name: "name",
    required: true,
    label: "Название",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "description",
    label: "Описание",
    field: (row) => `${row.property1}`,
  },
  {
    name: "first_name",
    label: "Исполнитель",
    field: (row) =>
      `${row.property2.fullname.first_name} ${row.property2.fullname.last_name}`,
  },
  {
    name: "status",
    label: "Статус",
    field: (row) => `${row.property3}`,
  },
];

onMounted(() => {
  if (!rows.value) refetch();
});
</script>
