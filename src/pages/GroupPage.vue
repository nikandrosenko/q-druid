<template>
  <div class="q-pa-md">
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h6">{{ page.title }}</div>
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
import { reactive, onMounted } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { computed } from "vue";
import { getPage, getGroupSubjects } from "src/graphql/queries";

const group_id = 6579648768563146067;
const id = 5901342623205784345;

const { result: page } = useQuery(getPage, {
  id: id});
console.log(page.id)

const { result: subjects } = useQuery(getGroupSubjects, {
  group_id: page?.subject?.id,
});
console.log(group_id)

</script>
