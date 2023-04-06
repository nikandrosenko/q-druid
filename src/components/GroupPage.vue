<template>
  <div class="q-pa-md">
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h6">{{ page?.page.title }}</div>
      </q-card-section>
      <q-markup-table>
        <thead>
        <tr>
          <th class="text-left">Имя</th>
          <th class="text-left">Фамилия</th>
          <th class="text-left">Почта</th>
        </tr>
        </thead>
        <tbody v-for="user in tableUsers" :key="user.id">
        <tr>
          <td>{{ user.fullname.first_name }}</td>
          <td>{{ user.fullname.last_name }}</td>
          <td>{{ user.email.email }}</td>
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
import {computed, ref} from "vue";

const route = useRoute();
const id = route.params.id;

const { result: page } = useQuery(getPage, {
  id: id});
console.log(id)

const subjectId = computed(() => page.value?.page?.object.id);
const tableUsers = ref([]);
const { result, onResult  } = useQuery(getGroupSubjects, {
  group_id: subjectId,
});
onResult(() => {
  tableUsers.value = result.value.get_group.subject;
  console.log(tableUsers.value);
});

</script>
