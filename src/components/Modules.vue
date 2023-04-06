<template>
  <q-dialog v-model="prompt">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Создать модуль</div>
      </q-card-section>

      <form @submit.prevent="creatingModule">
        <q-input v-model="moduleName" label="Имя модуля" />
        <q-select
          v-model="modelUserModule"
          :options="optionsUserModule"
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
const { result, loading } = useQuery(getModulesAll);
const { result: groupSubject } = useQuery(getGroupSubjects, {
  group_id: "3163550221139005516",
});
const rows = ref(result?.value?.paginate_type1?.data);
const prompt = ref(false);
const moduleName = ref("");
const modelUserModule = ref("");
const groupSubjectUsers = ref(
  groupSubject?.value?.get_group.subject.map((el) => {
    return {
      label: `${el.fullname.first_name} ${el.fullname.last_name}`,
      value: el.user_id,
    };
  })
);
const optionsUserModule = groupSubjectUsers.value;
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
    label: "Ответсвенный",
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
const creatingModule = () => {
  console.log(groupSubjectUsers.value);
  const { mutate: createdModule } = useMutation(createModule, {
    input: {
      name: moduleName,
      property5: {
        "8044196206941661177": "8212866342665324878",
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
  const { mutate: creatingPage } = useMutation(createPage, {
    input: {
      title: createdModule.create_type1.record.name,
      parent_id: "3642539153476219801",
      object: {
        id: createdModule.create_type1.recordId,
        type_id: createdModule.create_type1.record.type_id,
      },
    },
  });
  const { mutate: creatingPermissionRule } = useMutation(createPermissionRule);
  const { data: createdPermissionRuleForPage } = creatingPermissionRule({
    input: {
      model_type: "page",
      model_id: creatingPage.pageCreate.recordId,
      owner_type: "subject",
      owner_id: modelUserModule.value,
      level: 5,
    },
  });
  const { data: createdPermissionRuleForModuleObject } = creatingPermissionRule(
    {
      input: {
        model_type: "object",
        model_id: createdModule.create_type1.recordId,
        owner_type: "subject",
        owner_id: modelUserModule.value,
        level: 5,
      },
    }
  );
  createdModule()
    .then((res) => {
      if (!res.errors) {
        creatingPage();
        createdPermissionRuleForPage();
        createdPermissionRuleForModuleObject();
      } else {
        console.log(2);
      }
    })
    .catch((e) => {
      if (e.graphQLErrors) {
        console.log(e.graphQLErrors);
      }
    });
};
</script>
