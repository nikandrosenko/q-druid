<template>
    <q-dialog v-model="prompt">
      <Form :dataUpdate="dataUpdate" :updateDeleteType="updateDeleteType" @Create="moduleCreate" @Update="moduleUpdateElement"/>
    </q-dialog>


  <div class="q-ma-xl">
    <q-btn
      label="Создать"
      color="primary"
      @click="
        {
          updateDeleteType.bool = true;
          moduleUpdateElementForm()
          prompt = true;
        }
      "
    />
    <div v-if="loading">
      <p>Загрузка</p>
    </div>
    <div v-else class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="index">
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
import { useMutation, useQuery } from "@vue/apollo-composable";
import { ref } from "vue";
import {
  createModule,
  createPermissionRule,
  createPage,
  deleteModule,
  deletePage,
  updateModule,
  updatePage,
  updatePermissionRule
} from "src/graphql/mutations.js";
import {
  getModulesAll,
  getPagesModule,
} from "src/graphql/queries.js";
import Form from "./Form.vue";

const rows = ref();

const { result, loading, onResult, refetch } = useQuery(getModulesAll);


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
    })

const dataUpdate = ref({

  })

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

const moduleCreate = async (emitValue) => {

  console.log(emitValue.emitValue.date.value)

  const { mutate: creatingModule } = useMutation(createModule);
  const { data: createdModule } = await creatingModule({
    input: {
      name: emitValue.emitValue.moduleName.value,
      property5: {
        "8044196206941661177": emitValue.emitValue.modelUserModule.value.value,
      },
      property6: {
        date: emitValue.emitValue.date.value.dateStart,
        time: emitValue.emitValue.date.value.timeStart,
      },
      property7: {
        date: emitValue.emitValue.date.value.dateEnd,
        time: emitValue.emitValue.date.value.timeEnd,
      },
    },
  });

  const { mutate: creatingPage } = useMutation(createPage);
  const { data: createdPage } = await creatingPage({
    input: {
      title: createdModule.create_type1.record.name,
      parent_id: "3642539153476219801",
      icon: "list_alt",
      object: {
        id: createdModule.create_type1.recordId,
        type_id: createdModule.create_type1.record.type_id,
      },
    },
  });

  const { mutate: creatingPermissionRule } = useMutation(createPermissionRule);
  const { data: createdPermissionRuleForPage } = await creatingPermissionRule({
    input: {
      model_type: "page",
      model_id: createdPage.pageCreate.recordId,
      owner_type: "subject",
      owner_id: emitValue.emitValue.modelUserModule.value.value,
      level: 5,
    },
  });

  const { data: createdPermissionRuleForModuleObject } =
    await creatingPermissionRule({
      input: {
        model_type: "object",
        model_id: createdModule.create_type1.recordId,
        owner_type: "subject",
        owner_id: emitValue.emitValue.modelUserModule.value.value,
        level: 5,
      },
    });

    refetch()

  return {
    createdModule,
    createdPage,
    createdPermissionRuleForPage,
    createdPermissionRuleForModuleObject,
  };
};

const { mutate: deletingModule } = useMutation(deleteModule);
const { mutate: deletingPage } = useMutation(deletePage);

const moduleDelete = async (moduleId, pageId) => {
  const { data: delM } = await deletingModule({
    module_id: moduleId,
  });

  const { data: delP } = await deletingPage({
    page_id: pageId,
  });

  return{
    delM,
    delP
  }
};

const delModule = ref();

const { result: pageData } = useQuery(getPagesModule, {
  id: "3642539153476219801",
});

const moduleDeleteElement = (id) => {
  delModule.value = pageData?.value?.page.children.data.find(
    (el) => el.object.id == id
  );

  moduleDelete(id, delModule.value.id);

  refetch();
};

const { mutate: updatingModule } = useMutation(updateModule);
const { mutate: updatingPage } = useMutation(updatePage);
const { mutate: updatingPermissionRule } = useMutation(updatePermissionRule)

const updatedModule = ref();

const moduleUpdate = async (moduleId, pageId, emitValue) => {
  const { data: updateM } = await updatingModule({
    id: moduleId,
    input: {
      name: emitValue.emitValue.moduleName.value,
      property5: {
        "8044196206941661177": emitValue.emitValue.modelUserModule.value.value,
      },
      property6: {
        date: emitValue.emitValue.date.value.dateStart,
        time: emitValue.emitValue.date.value.timeStart,
      },
      property7: {
        date: emitValue.emitValue.date.value.dateEnd,
        time: emitValue.emitValue.date.value.timeEnd,
      },
    },
  });

  const { data: updateP } = await updatingPage({
    id: pageId,
    input: {
      title: emitValue.emitValue.moduleName.value,
    },
  });

  console.log(updateM, updateP);

  refetch();
};

const moduleUpdateElementForm = (index) => {

  if(updateDeleteType.value.bool){
    dataUpdate.value = {
    dateUpdate: {
      dateUpdateEnd: '01.01.2021',
      dateUpdateStart: '01.01.2021',
      timeUpdateStart: '00:00:00',
      timeUpdateEnd: '00:00:00',
    },

    moduleNameUpdate: "",
    modelUserModuleUpdate: ""
  }
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
    }
  }
  }

};

const moduleUpdateElement = (emitValue) => {
  updatedModule.value = pageData?.value?.page.children.data.find(
    (el) => el.object.id == emitValue.emitValue.id
  );

  moduleUpdate(emitValue.emitValue.id, updatedModule.value.id, emitValue);
};
</script>
