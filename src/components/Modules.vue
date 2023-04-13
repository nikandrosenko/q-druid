<template>
  <q-dialog v-model="prompt">
    <Form
      :dataUpdate="dataUpdate"
      :updateDeleteType="updateDeleteType"
      @Create="moduleCreateModules"
      @Update="moduleUpdateElement"
    />
  </q-dialog>

  <q-dialog v-model="secondDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-orange text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Ошибка</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          В этом модуле еще есть задачи!!!
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  <div class="q-ma-xl">
    <q-btn
      label="Создать"
      color="primary"
      @click="
        {
          updateDeleteType.bool = true;
          moduleUpdateElementForm();
          prompt = true;
        }
      "
    />
    <div v-if="loading">
      <p>Загрузка</p>
    </div>
    <div v-else class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="index">
        <template v-slot:header="props" >
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props" >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" :class="props.row.status.label==='Выполнено' ? 'bg-green' : props.row.status.label==='Назначено' ? 'bg-red' : 'bg-orange'">
            <q-td auto-width >
              <q-btn
                size="sm"
                color="primary"
                round
                dense
                @click="moduleDeleteElement(props.row.id)"
                icon="clear"
              />

              <q-btn
                size="sm"
                color="primary"
                round
                dense
                @click="
                  {
                    updateDeleteType.bool = false;
                    updateDeleteType.id = props.row.id;
                    moduleUpdateElementForm(props.row.index);
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Form from "./Form.vue";
import moduleApi from 'src/sdk/module.js'
import { getModulesAll, getPagesModule } from "src/graphql/queries.js";
import { useQuery } from "@vue/apollo-composable";

const { result, loading, onResult, refetch } = useQuery(getModulesAll);

const { result: pageData } = useQuery(getPagesModule, {
        id: process.env.MODULES_PAGE_ID,
      });

const rows = ref();

const secondDialog = ref(false)

onResult(() => {
  rows.value = result?.value?.paginate_type1?.data.map((el, i) => ({
    ...el,
    id: el.id,
    index: i,
  }));
});

const updateDeleteType = ref({
  bool: true,
  id: "",
});

const dataUpdate = ref({});

const prompt = ref(false);

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
    name: "first_name",
    label: "Ответственный",
    field: (row) =>
      `${row.property5.fullname.first_name} ${row.property5.fullname.last_name}`,
  },
  {
    name: "start",
    label: "Начало",
    field: (row) => `${row.property6.date} ${row.property6.time}`,
  },
  {
    name: "finish",
    label: "Конец",
    field: (row) => `${row.property7.date} ${row.property7.time}`,
  },
];

const delModule = ref([]);
const tasksModule = ref([]);

const moduleDeleteElement = (id) => {

  delModule.value = pageData?.value?.page.children.data.find(
    (el) => el.object.id == id
    );

  tasksModule.value = result?.value?.paginate_type1?.data.find((el) => el.id === id)

    if(tasksModule.value.property4.length > 0){
      secondDialog.value = true
    } else {

      moduleApi.moduleDelete(id, delModule.value.id);

      refetch()
    }

  };

const updatedModule = ref();

const moduleUpdateElementForm = (index) => {
  if (updateDeleteType.value.bool) {
    dataUpdate.value = {
      dateUpdate: {
        dateUpdateEnd: "01.01.2021",
        dateUpdateStart: "01.01.2021",
        timeUpdateStart: "00:00:00",
        timeUpdateEnd: "00:00:00",
      },

      moduleNameUpdate: "",
      modelUserModuleUpdate: "",
    };
  } else {
    dataUpdate.value = {
      dateUpdate: {
        dateUpdateEnd: rows.value[index].property7.date,
        dateUpdateStart: rows.value[index].property6.date,
        timeUpdateStart: rows.value[index].property6.time,
        timeUpdateEnd: rows.value[index].property7.time,
      },

      moduleNameUpdate: rows.value[index].name,
      modelUserModuleUpdate: {
        label: `${rows.value[index].property5.fullname.first_name} ${rows.value[index].property5.fullname.last_name}`,
        value: rows.value[index].property5.id,
      },
    };
  }
};

const moduleCreateModules = (emitValue) => {

  moduleApi.moduleCreate(emitValue)

  refetch()
}

const moduleUpdateElement = (emitValue) => {
  updatedModule.value = pageData?.value?.page.children.data.find(
    (el) => el.object.id == emitValue.emitValue.id
  );

  moduleApi.moduleUpdate(emitValue.emitValue.id, updatedModule.value.id, emitValue);

  refetch()
};

onMounted(() => {
  if (!rows.value) refetch();
});

</script>
