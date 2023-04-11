<template>
  <q-page v-if="loading" class="flex text-h4 items-center justify-center">
    Загрузка...
  </q-page>
  <q-page v-else class="q-pa-md">
    <div class="text-h2">
      {{ page?.page.title }}
    </div>
    <section class="text-h4 q-mb-lg">
      <group
        v-if="pageType === 'Группа'"
        :page="page"
        :subjectId="subjectId"
        :id="id"
        @refresh="refresh"
      />
      <modules v-if="pageType === 'Модули'" />
      <module v-if="pageType === 'Модуль'" :page="page" />
      <tasks v-if="pageType === 'Задачи'" />
    </section>
  </q-page>
</template>

<script setup>
import { getPage } from "src/graphql/queries";
import { useQuery } from "@vue/apollo-composable";
import { useRoute } from "vue-router";
import { ref, onMounted, watch, computed } from "vue";
import Group from "src/components/Group.vue";
import Modules from "src/components/Modules.vue";
import Module from "src/components/Module.vue";
import Tasks from "src/components/Tasks.vue";

const route = useRoute();
const id = ref("");

const { result: page, loading } = useQuery(getPage, {
  id: id,
});

const subjectId = computed(() => page.value?.page?.object.id);

const defId = () => {
  id.value = route.params.id;
};

const refresh = () => {
  console.log("Кек");
};

const pageType = ref("");

const pageTypeUpdate = () => {
  const page_type_id = page.value?.page.object.type_id;
  switch (page_type_id) {
    case process.env.GROUP_ID:
      pageType.value = "Группа";
      break;
    case process.env.MODULES_ID:
      pageType.value = "Модули";
      break;
    case process.env.MODULE_ID:
      pageType.value = "Модуль";
      break;
    case process.env.TASKS_ID:
      pageType.value = "Задачи";
      break;
    case process.env.TASK_ID:
      pageType.value = "Задача";
      break;
  }
};

onMounted(() => {
  defId();
  if (pageType.value) return;
  pageTypeUpdate();
});

watch(page, (value) => {
  if (!value) return;
  pageTypeUpdate();
});
</script>
