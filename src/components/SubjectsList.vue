<template>
  <q-list>
    <SubjectItem
      v-for="subject in subjects"
      :key="subject.id"
      :subject="subject"
    />
  </q-list>
</template>

<script setup>
import SubjectItem from "./SubjectItem.vue";

const { subjects } = defineProps({
  subjects: Array,
});
</script>
