<template>
  <q-page>
    <SubjectTable
      :loading="loading"
      :title="getName()"
      :groups="subject?.get_subject?.group"
      :information="[
        { name: getName() },
        { name: subject?.get_subject?.email?.email },
      ]"
    />
  </q-page>
</template>

<script setup>
import SubjectTable from "src/components/SubjectTable.vue";
import { getSubject } from "src/graphql/queries";
import { useQuery } from "@vue/apollo-composable";
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id;

const { result: subject, loading } = useQuery(getSubject, {
  id: id,
});

const getName = () => {
  const fullname = subject.value?.get_subject?.fullname;
  return fullname?.first_name + " " + fullname?.last_name;
};
</script>
