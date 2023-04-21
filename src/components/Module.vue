<template>
  <q-page class="q-pa-md">
    <div class="flex">
      <q-dialog
        v-model="secondDialog"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card class="bg-orange text-white" style="width: 300px">
          <q-card-section>
            <div class="text-h6">Ошибка</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Задача не находится в статусе "Завершена"
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="OK" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="prompt">
        <TaskCreate :page="page" :updateData="updateData" />
      </q-dialog>

      <q-btn
        v-if="level === 7"
        label="Создать задачу"
        color="primary"
        @click="
          prompt = true;
          updateCreateType.bool = true;
          taskUpdateElementForm();
        "
      />
    </div>
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
                class="q-mr-sm"
                size="sm"
                color="primary"
                round
                dense
                @click="taskDeleteElement(props.row.id, props.row.index)"
                icon="clear"
              />
              <q-btn
                size="sm"
                color="primary"
                round
                dense
                @click="
                  {
                    updateCreateType.bool = false;
                    updateCreateType.id = props.row.id;
                    taskUpdateElementForm(props.row.index);
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
            <q-td class="text-right">
              {{ props.row.description }}
            </q-td>
            <q-td class="text-right">
              {{ props.row.executor.fullname.first_name }}
              {{ props.row.executor.fullname.last_name }}
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
import { useQuery } from "@vue/apollo-composable";
import { getModuleById } from "src/graphql/queries";
import { onMounted, ref } from "vue";
import TaskCreate from "./TaskCreate.vue";
import taskApi from "src/sdk/tasks.js";

const { page, level } = defineProps({
  page: Object,
  level: Number,
});

const prompt = ref(false);

const rows = ref();

const secondDialog = ref(false);

const {
  result: resultModule,
  refetch,
  loading,
  onResult,
} = useQuery(getModuleById, {
  module_id: page.page.object?.id,
});

onResult(() => {
  rows.value = resultModule?.value?.get_module?.tasks.map((el, i) => {
    let status = {};
    if (el.status === process.env.APPOINTED_ID) {
      status = {
        label: "Назначено",
        value: process.env.APPOINTED_ID,
      };
    } else if (el.status === process.env.COMPLETED_ID) {
      status = {
        label: "Выполнено",
        value: process.env.COMPLETED_ID,
      };
    } else {
      status = {
        label: "Завершено",
        value: process.env.FINISHED_ID,
      };
    }
    return {
      ...el,
      id: el.id,
      index: i,
      status: status,
    };
  });
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
    field: (row) => `${row.description}`,
  },
  {
    name: "first_name",
    label: "Исполнитель",
    field: (row) =>
      `${row.executor.fullname.first_name} ${row.executor.fullname.last_name}`,
  },
  {
    name: "status",
    label: "Статус",
    field: (row) => `${row.status.label}`,
  },
];

const updateData = ref();
const updateCreateType = ref({
  bool: true,
  id: "",
});

const taskDeleteElement = (id, index) => {
  if (rows.value[index].status.value !== process.env.FINISHED_ID) {
    secondDialog.value = true;
  } else {
    taskApi.taskDelete(id);
  }
};

const taskUpdateElementForm = (index) => {
  if (updateCreateType.value.bool) {
    updateData.value = {
      updateCreateType: updateCreateType.value,

      moduleNameUpdate: "",
      moduleDescriptionUpdate: "",
      modelUserModuleUpdate: {
        label: "",
        value: "",
      },
      moduleStatusUpdate: "",
    };
  } else {
    updateData.value = {
      updateCreateType: updateCreateType.value,
      moduleNameUpdate: rows.value[index].name,
      moduleDescriptionUpdate: rows.value[index].description,
      modelUserModuleUpdate: {
        label: `${rows.value[index].executor.fullname.first_name} ${rows.value[index].executor.fullname.last_name}`,
        value: rows.value[index].executor.id,
      },
      moduleStatusUpdate: rows.value[index].status,
    };
  }
};

onMounted(() => {
  if (!rows.value) refetch();
});
</script>
