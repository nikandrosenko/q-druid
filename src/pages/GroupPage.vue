<!-- <template>
  <q-page v-if="loading" class="flex text-h4 items-center justify-center">
    Загрузка...
  </q-page>
  <q-page v-else class="q-pa-md">
    <div>
      <section class="text-h4 q-mb-lg">
        {{ page?.page.title }}
      </section>
      <section class="text-h5">Участники:</section>
    </div>
  </q-page>
</template>

<script setup>
import { getPage } from "src/graphql/queries";
import { useQuery } from "@vue/apollo-composable";
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id;

const { result: page, loading } = useQuery(getPage, {
  id: id,
});
</script> -->

<template>
  <div class="q-pa-md">
    <!-- <pre>{{ page }}</pre> -->
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h6">{{ page?.title }}</div>
        <div class="text-subtitle2">by John Doe</div>
      </q-card-section>
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">Участник</th>
            <th class="text-right">Вторая колонна</th>
          </tr>
        </thead>
        <tbody v-for="user in subjects" :key="user.id">
          <tr>
            <td>{{ user.subject.fullname.first_name }}</td>
            <td>{{ user.subject.fullname.last_name }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card>
  </div>
</template>
<script setup>
import { useQuery } from "@vue/apollo-composable";
import { getPage, getGroupSubjects } from "src/graphql/queries";

const group_id = 6579648768563146067;
const id = "5901342623205784345";

const { result: page } = useQuery(getPage, {
  id: id,
});
console.log(page.id);
const { result: subjects } = useQuery(getGroupSubjects, {
  group_id: page?.subject?.id,
});
console.log(group_id);
</script>
