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
import { getTasksAll, getUserTasks } from "src/graphql/queries.js";

const isNewUser = ref(false);
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
  // {
  //   name: "executor_name",
  //   label: "Исполнитель",
  //   field: (row) =>
  //     `${row.property2.fullname.first_name} ${row.property2.fullname.last_name}`,
  // },
  // {
  //   name: "responsible_name",
  //   label: "Ответственный",
  //   field: (row) =>
  //     `${row.property4.property5.fullname.first_name} ${row.property4.property5.fullname.last_name}`,
  // },
  {
    name: "status",
    label: "Статус",
    field: (row) => `${row.property3}`,
  },
];
let st = ref();
// const { result, loading, onResult, refetch } = useQuery(getTasksAll);
const { result, loading, onResult, refetch } = useQuery(getUserTasks);
onResult(() => {
  rows.value = result?.value?.paginate_subject?.data[0]?.property2?.map(
    (el) => ({
      ...el,
      index: el.id,
      // st: ref(rows.value.property3),
    })
  );
  console.log(rows.value);
  console.log(
    result?.value?.paginate_subject?.data[0]?.user_id.toString().slice(0, 13)
  );
  console.log(localStorage.getItem("userId").slice(0, 13));
  isNewUser.value = false;
  if (
    localStorage.getItem("userId").slice(0, 13) ===
    result?.value?.paginate_subject?.data[0]?.user_id.toString().slice(0, 13)
  ) {
    isNewUser.value = true;
  }
  console.log(isNewUser.value);
});

// const defineStatus = () => {
//   st.value === "7530914918500818452" ? (st.value = "onGoing") : "else";
// };
// defineStatus();
// console.log(st.value);
onMounted(() => {
  if (!rows.value) refetch();
});
</script>
