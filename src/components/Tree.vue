<template>
  <q-list>
    <q-tree
      :nodes="treePages"
      node-key="label"
      no-connectors
      no-selection-unset
      selected-color="primary"
      color="black"
      v-model:selected="selected"
      v-model:expanded="expanded"
    />
  </q-list>
</template>

<script setup>
import { ref } from "vue";
import { pages } from "src/graphql/queries";
import { useQuery } from "@vue/apollo-composable";
import { useRouter } from "vue-router";

const router = useRouter();

const treePages = ref([]);
const parentPages = ref([]);
const selected = ref();
const expanded = ref([]);

const myclick = (node) => {
  router.push({
    name: "page",
    params: { id: node.id },
  });
};

const { result: currentSpacePages, onResult } = useQuery(pages);
onResult(() => {
  parentPages.value = currentSpacePages?.value?.rootPages?.data;
  parentPages.value.forEach((page) => {
    let treeElem = {
      id: page.id,
      label: page.title,
      icon: page.icon,
      handler: (node) => myclick(node),
      children: page.children.data.map((elem) => {
        elem = {
          id: elem.id,
          label: elem.title,
          icon: elem.icon,
          handler: (node) => myclick(node),
        };
        return elem;
      }),
    };
    treePages.value.push(treeElem);
  });
  selected.value = treePages.value[0].label;
  expanded.value.push(selected.value);
});
</script>
