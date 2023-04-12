<template>
  <q-page class="q-pa-md">
    <div class="flex">

      <q-dialog v-model="prompt">
        <TaskCreate :page="page" :updateData="updateData"/>
      </q-dialog>

    <q-btn label="Создать задачу" color="primary" @click="prompt = true; updateCreateType.bool = true; taskUpdateElementForm()" />

    </div>
    <div v-if="loading">
      <p>Загрузка</p>
    </div>
    <div v-else class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="index" >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props" >
          <q-tr :props="props" :class="props.row.status.label==='Выполнено' ? 'bg-purple' : props.row.status.label==='Назначено' ? 'bg-light-green' : 'bg-yellow'">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="primary"
                round
                dense
                @click="taskDeleteElement(props.row.id)"
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
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
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
import taskApi  from 'src/sdk/tasks.js'

const { page } = defineProps({
  page: Object,
});

const prompt = ref(false);


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
  rows.value = resultModule?.value?.get_type1?.property4.map((el, i) => {
    let status = {}
    if(el.property3===process.env.APPOINTED_ID)
    {status = {
      label: 'Назначено',
      value: process.env.APPOINTED_ID
    }}
    else if(el.property3===process.env.COMPLETED_ID)
    {status = {
      label: 'Выполнено',
      value: process.env.COMPLETED_ID
    }}
    else
    {status = {
      label: 'Завершено',
      value: process.env.FINISHED_ID
    }}
    return{
    ...el,
    id: el.id,
    index: i,
      status: status
  }});
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
    field: (row) => `${row.status.label}`,
  },
];

const updateData = ref();
const updateCreateType = ref({
    bool: true,
    id: ''
})

const taskDeleteElement = (id) => {

  taskApi.taskDelete(id);

}

const taskUpdateElementForm = (index) => {
  console.log(updateCreateType.value)
    if(updateCreateType.value.bool){
      updateData.value = {
      updateCreateType: updateCreateType.value,

      moduleNameUpdate: '',
      moduleDescriptionUpdate: '',
      modelUserModuleUpdate: {
        label: '',
        value: '',
      },
        moduleStatusUpdate: '',
  }
    } else {
      updateData.value = {
      updateCreateType: updateCreateType.value,
      moduleNameUpdate: rows.value[index].name,
      moduleDescriptionUpdate: rows.value[index].property1,
      modelUserModuleUpdate: {
        label: `${rows.value[index].property2.fullname.first_name} ${rows.value[index].property2.fullname.last_name}`,
        value: rows.value[index].property2.id,
      },
        moduleStatusUpdate: rows.value[index].status,
    }
  }
}


onMounted(() => {
  if (!rows.value) refetch();
});
</script>
