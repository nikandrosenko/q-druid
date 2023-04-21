<template>
  <q-page class="q-ma-xl">
    <q-dialog v-model="prompt">
      <FormTasks :updateData="updateData" />
    </q-dialog>

    <div v-if="loading">
      <p>Загрузка</p>
    </div>
    <div v-else class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="index" hide-pagination>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="primary"
                round
                dense
                @click="
                  {
                    tasksUpdateElementForm(props.row.index, props.row.id);
                    prompt = true;
                  }
                "
                icon="create"
              />
            </q-td>
            <!-- <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td> -->
            <q-td>
              {{ props.row.name }}
            </q-td>
            <q-td>
              {{ props.row.description }}
            </q-td>
            <q-td class="text-right">
              <span
                class="q-pa-sm rounded-borders"
                :class="
                  props.row.status.label === 'Выполнено'
                    ? 'bg-yellow'
                    : props.row.status.label === 'Назначено'
                    ? 'bg-pink'
                    : 'bg-green'
                "
              >
                {{ props.row.status.label }}
              </span>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:no-data>
          <div class="q-pa-md">
            <p>Список задач пуст</p>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { getUserTasks } from "src/graphql/queries";
import FormTasks from "./FormTasks.vue";

const prompt = ref(false);

const updateData = ref();

const { page } = defineProps({
  page: Object,
});

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
    align: "left",
    field: (row) => `${row.description}`,
  },
  {
    name: "status",
    label: "Статус",
    field: (row) => `${row.status.label}`,
  },
];

const { result, loading, onResult, refetch } = useQuery(getUserTasks, {
  where: {
    column: "user_id",
    operator: "EQ",
    value: localStorage.getItem("userId"),
  },
});

onResult(() => {
  rows.value = result?.value?.paginate_subject?.data[0]?.tasks?.map((el, i) => {
    let statusName = {};
    if (el.status === process.env.APPOINTED_ID) {
      statusName = {
        label: "Назначено",
        value: process.env.APPOINTED_ID,
      };
    } else if (el.status === process.env.COMPLETED_ID) {
      statusName = {
        label: "Выполнено",
        value: process.env.COMPLETED_ID,
      };
    } else {
      statusName = {
        label: "Завершено",
        value: process.env.FINISHED_ID,
      };
    }
    return {
      ...el,
      id: el.id,
      index: i,
      status: statusName,
    };
  });
});

const tasksUpdateElementForm = (index, id) => {
  updateData.value = {
    id: id,
    moduleNameUpdate: rows.value[index].name,
    moduleDescriptionUpdate: rows.value[index].description,
    modelUserModuleUpdate: {
      label: `${rows.value[index].executor.fullname.first_name} ${rows.value[index].executor.fullname.last_name}`,
      value: rows.value[index].executor.id,
    },
    moduleStatusUpdate: rows.value[index].status,
  };
};

onMounted(() => {
  if (!rows.value) refetch();
});
</script>
