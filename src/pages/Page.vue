<template>
  <q-page v-if="loading" class="flex text-h4 items-center justify-center">
    Загрузка...
  </q-page>
  <q-page v-else class="q-pa-md">
    <div>
      {{ page.value?.title }}
    </div>
    <section class="text-h4 q-mb-lg">
      <group-page />
      <modules />
    </section>
  </q-page>
</template>

<script setup>
import { getPage } from "src/graphql/queries";
import { useQuery } from "@vue/apollo-composable";
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import GroupPage from "src/components/GroupPage.vue";
import Modules from "src/components/Modules.vue";

const route = useRoute();
const id = route.params.id;
const typeId = ref("");

// onMounted(() => {
//   id.value = route.params.id;
// });

// console.log(id);

const {
  result: page,
  loading,
  onResult,
} = useQuery(getPage, {
  id: id,
});

onResult(() => {
  // console.log(page.value?.page.object.type_id);
  // typeId.value = page.value?.page.object.type_id;
  // console.log(typeId.value);
  if (page.value.page.object.type_id === "4148214827964057161")
    console.log("Это группа");
  if (page.value.page.object.type_id === "4402508105138320402")
    console.log("Это модуль");
  if (page.value.page.object.type_id === "7792914758758546861")
    console.log("Это задача");
  if (page.value.page.object.type_id === "4819869896194502672")
    console.log("Это модули");
  if (page.value.page.object.type_id === "6056878233713674988")
    console.log("Это мои задачи");
});

// const isGroup = () => {
//   if (typeId.value === "4148214827964057161") {
//     console.log("SSSS");
//     return true;
//   }
// };
// const isModules = () => {
//   if (typeId.value === "4819869896194502672") {
//     console.log("SSSS");
//     return true;
//   }
// };
</script>
