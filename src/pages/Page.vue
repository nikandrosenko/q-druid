<template>
  <q-page v-if="loading" class="flex text-h4 items-center justify-center">
    Загрузка...
  </q-page>
  <q-page v-else class="q-pa-md">
    <div>
      <section class="text-h4 q-mb-lg">
        <group-page/>
      </section>
    </div>
  </q-page>

</template>

<script setup>
import { getPage } from "src/graphql/queries";
import { useQuery } from "@vue/apollo-composable";
import { useRoute } from "vue-router";
import GroupPage from "src/components/GroupPage.vue"

const route = useRoute();
const id = route.params.id;

console.log(id);

const { result: page, loading } = useQuery(getPage, {
  id: id,
});
</script>
