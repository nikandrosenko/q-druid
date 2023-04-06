<template>
  <div class="q-pa-md">
<!--    <pre>{{ page }}</pre>-->
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h6">{{ page?.page.title }}</div>
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
import { useQuery } from '@vue/apollo-composable';
import { getPage, getGroupSubjects } from "src/graphql/queries";
import {useRoute} from "vue-router/dist/vue-router";

const group_id = '6579648768563146067';
// const id = '6272730201780481324';
const route = useRoute();
const id = route.params.id;

const { result: page } = useQuery(getPage, {
  id: id});
console.log(id)
const { result: subjects } = useQuery(getGroupSubjects, {
  group_id: group_id,
});
console.log(group_id)

</script>
