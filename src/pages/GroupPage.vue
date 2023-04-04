<template>
  <div class="q-pa-md">
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h6">{{ page.page.title }}</div>
        <div class="text-subtitle2">by John Doe</div>
      </q-card-section>
      <q-markup-table>
        <thead>
        <tr>
          <th class="text-left">Dessert (100g serving)</th>
          <th class="text-right">Calories</th>
          <th class="text-right">Fat (g)</th>
          <th class="text-right">Carbs (g)</th>
          <th class="text-right">Protein (g)</th>
          <th class="text-right">Sodium (mg)</th>
        </tr>
        </thead>
        <tbody v-for="user in getGroupSubjects.get_group" :key="user.id">
        <tr>
          <td>{{ user.FIO }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.age }}</td>
          <td>{{ user.sex }}</td>
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

const childrenPages = '';
const { result, onResult } = useQuery(gql`
      query {
        page(id: "6932152816939161311") {
          id
          parent_id
          page_type
          title
          content
          icon
          level
          is_public
          position
          config
          is_block
          children(perPage: 10, page: 1) {
            data {
              id
              title
            }
          }
          created_at
          updated_at
        }
      }
    `);
onResult(() => {
  childrenPages.value = result.value.page.title;
  console.log(childrenPages.value);
});


const { result: page } = useQuery(getPage, {
  id: id,
});
const subjectId = computed(() => page.value.page.object.id);

const { result: subjects } = useQuery(getGroupSubjects, {
  group_id: subjectId,
});

</script>
