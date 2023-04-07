<template>
  <q-page v-if="loading" class="flex text-h4 items-center justify-center">
    Загрузка...
  </q-page>
  <q-page v-else class="q-pa-md">
    <div class="text-h2">
      {{ page?.page.title }}
    </div>
    <section class="text-h4 q-mb-lg">
      <group v-if="typeId === '4148214827964057161'" />
      <modules v-if="typeId === '4819869896194502672'" />
      <tasks v-if="typeId === '6056878233713674988'" />
    </section>
  </q-page>
</template>

<script setup>
import { getPage } from "src/graphql/queries";
import { useQuery } from "@vue/apollo-composable";
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import Group from "src/components/Group.vue";
import Modules from "src/components/Modules.vue";
import Tasks from "src/components/Tasks.vue";

const route = useRoute();
const id = ref("");
const typeId = ref("");

onMounted(() => {
  id.value = route.params.id;
});

const {
  result: page,
  loading,
  onResult,
} = useQuery(getPage, {
  id: id,
});

onResult(() => {
  typeId.value = page.value?.page.object.type_id;
  if (typeId.value === "4148214827964057161") console.log("Это группа");
  if (typeId.value === "4402508105138320402") console.log("Это модуль");
  if (typeId.value === "7792914758758546861") console.log("Это задача");
  if (typeId.value === "4819869896194502672") console.log("Это модули");
  if (typeId.value === "6056878233713674988") console.log("Это мои задачи");
});
</script>
