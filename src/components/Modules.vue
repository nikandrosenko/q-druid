<template>
  <q-dialog v-model="prompt">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Создать модуль</div>
      </q-card-section>

      <form @submit.prevent="moduleCreate">
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
    </q-card>
  </q-dialog>

  <div class="q-ma-xl">
    <q-btn label="Создать" color="primary" @click="prompt = true" />

    <div v-if="loading">
      <p>Загрузка</p>
    </div>
    <div v-else class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="name" />
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
} from "src/graphql/mutations.js";
import { getModulesAll, getGroupSubjects } from "src/graphql/queries.js";
const rows = ref();
const groupSubjectUsers = ref();
const { result, loading, onResult } = useQuery(getModulesAll);
const { result: groupSubject, onResult: onResult2 } = useQuery(
  getGroupSubjects,
  {
    group_id: "3163550221139005516",
  }
);
onResult(() => {
  rows.value = result?.value?.paginate_type1?.data;
});
onResult2(() => {
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
  console.log("createdModule", createdModule);
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
  console.log("createdPage", createdPage);
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
        model_id: createdModule.create_type1.recordId,
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
  // creatingModule()
  //   .then((res) => {
  //     if (!res.errors) {
  //       creatingPage();
  //       createdPermissionRuleForPage();
  //       createdPermissionRuleForModuleObject();
  //     } else {
  //       console.log(2);
  //     }
  //   })
  //   .catch((e) => {
  //     if (e.graphQLErrors) {
  //       console.log(e.graphQLErrors);
  //     }
  //   });
};
</script>
