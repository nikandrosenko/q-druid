<template>
  <q-dialog v-model="prompt">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div v-if="updateDeleteType.bool" class="text-h6">Создать модуль</div>
        <div v-else class="text-h6">Изменить модуль</div>
      </q-card-section>

      <form @submit.prevent="moduleCreate" v-if="updateDeleteType.bool">
        <q-input v-model="moduleName" label="Имя модуля" />
        <q-select
          v-model="modelUserModule"
          :options="groupSubjectUsers"
          label="Ответственный"
        />

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Создать" v-close-popup type="submit" />
        </q-card-actions>
      </form>
      <form @submit.prevent="moduleUpdateElement(updateDeleteType.id);" v-else>
        <q-input v-model="moduleNameUpdate" label="Имя модуля" />
        <q-select
          v-model="modelUserModuleUpdate"
          :options="groupSubjectUsers"
          label="Ответственный"
        />

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Изменить" v-close-popup type="submit" />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>

  <div class="q-ma-xl">
    <q-btn label="Создать" color="primary" @click="{prompt = true; updateDeleteType.bool = true}" />

    <div v-if="loading">
      <p>Загрузка</p>
    </div>
    <div v-else class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="index" >

        <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="primary" round dense @click="moduleDeleteElement(props.row.id)" icon="clear" />
            <q-btn size="sm" color="primary" round dense @click="{updateDeleteType.bool = false; updateDeleteType.id = props.row.id; prompt = true; moduleUpdateElementForm(props.row.index)}" icon="create" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
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
  deletePage
} from "src/graphql/mutations.js";
import { getModulesAll, getGroupSubjects, getPagesModule } from "src/graphql/queries.js";

const rows = ref();
const groupSubjectUsers = ref();
const updateDeleteType = ref({
  bool: true,
  id: ''
})
const { result, loading, onResult, refetch } = useQuery(getModulesAll);
const { result: groupSubject, onResult: onResultGetGroup } = useQuery(
  getGroupSubjects,
  {
    group_id: "3163550221139005516",
  }
);

onResult(() => {
  rows.value = result?.value?.paginate_type1?.data.map((el, i) => ({...el, id: el.id, index: i}));
});

onResultGetGroup(() => {
  groupSubjectUsers.value = groupSubject?.value?.get_group.subject.map((el) => {
    return {
      label: `${el.fullname.first_name} ${el.fullname.last_name}`,
      value: el.id,
    };
  });
});

const prompt = ref(false);
const moduleName = ref("");
const modelUserModule = ref("");
const moduleNameUpdate = ref("")
const modelUserModuleUpdate = ref("")

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

const moduleCreate = async () => {

  const { mutate: creatingModule } = useMutation(createModule);
  const { data: createdModule } = await creatingModule({
    input: {
      name: moduleName.value,
      property5: {
        "8044196206941661177": modelUserModule.value.value,
      },
      property6: {
        date: "01.01.2023",
        time: "01:00:00",
      },
      property7: {
        date: "01.01.2023",
        time: "23:59:00",
      },
    },
  });

  const { mutate: creatingPage } = useMutation(createPage);
  const { data: createdPage } = await creatingPage({
    input: {
      title: createdModule?.value?.create_type1.record.name,
      parent_id: "3642539153476219801",
      object: {
        id: createdModule?.value?.create_type1.recordId,
        type_id: createdModule?.value?.create_type1.record.type_id,
      },
    },
  });

  const { mutate: creatingPermissionRule } = useMutation(createPermissionRule);
  const { data: createdPermissionRuleForPage } = await creatingPermissionRule({
    input: {
      model_type: "page",
      model_id: createdPage.pageCreate.recordId,
      owner_type: "subject",
      owner_id: modelUserModule.value.value,
      level: 5,
    },
  });

  const { data: createdPermissionRuleForModuleObject } =
    await creatingPermissionRule({
      input: {
        model_type: "object",
        model_id: createdModule?.value?.create_type1.recordId,
        owner_type: "subject",
        owner_id: modelUserModule.value.value,
        level: 5,
      },
    });

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

  console.log(delM, delP);
};

const delModule = ref()

const { result: pageData } = useQuery(getPagesModule, {
  id: "3642539153476219801"
})

const moduleDeleteElement = (id) => {

    delModule.value = pageData?.value?.page.children.data.find(el => el.object.id == id )

    moduleDelete(id, delModule.value.id)

    refetch()

}

const moduleUpdateElementForm = (index) => {
  moduleNameUpdate.value = rows.value[index].name
  modelUserModuleUpdate.value = {
    label: `${rows.value[index].property5.fullname.first_name} ${rows.value[index].property5.fullname.last_name}`,
    value:  rows.value[index].property5.id
  }

}

const moduleUpdateElement = (id) => {


  console.log(id)
}
</script>
