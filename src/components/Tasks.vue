<template>
  <q-page class="q-ma-xl">
    <div v-if="loading">
      <p>Загрузка</p>
    </div>
    <div v-else class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="name" />
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { getTasksAll } from "src/graphql/queries.js";

const rows = ref();
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
    field: (row) => `${row.property3 === '7530914918500818452' ? 'Назначена':'Выполнена'}`,
  },
  {
    name: "module",
    label: "Модуль",
    field: (row) => `${row.property4.name}`,
  },
];
let st = ref();
const { result, loading, onResult, refetch } = useQuery(getTasksAll);
onResult(() => {
  rows.value = result?.value?.paginate_type2?.data.map((el) => ({
    ...el,
    index: el.id,
    st: ref(rows.value),
  }));
});
const defineStatus = () => {
  st.value === '7530914918500818452' ? st.value = 'onGoing':'else'
};
defineStatus()
console.log(st.value)
onMounted(() => {
  if (!rows.value) refetch();
});
</script>
