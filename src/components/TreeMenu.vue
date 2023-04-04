<template>
  <q-list>
    <Tree v-for="page in pages" :key="page.id" :page="page" />
  </q-list>
</template>

<script setup>
import Tree from "./Tree.vue";
const { pages } = defineProps({
  pages: Array,
});
</script>
