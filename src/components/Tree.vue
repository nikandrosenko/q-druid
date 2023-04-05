<template>
  <q-list>
    <q-tree
      :nodes="treePages"
      node-key="label"
      no-connectors
      v-model:selected="selected"
      v-model:expanded="expanded"
      color="primary"
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
const rout = ref("");

const myclick = (node) => {
  if (currentSpacePages?.value?.rootPages?.data.__typename === "Page") {
    rout.value = "page";
  }
  router.push({
    name: "page",
    params: { id: node.id },
  });
  console.log(node.id, node.label);
};

const { result: currentSpacePages, onResult } = useQuery(pages);
onResult(() => {
  console.log(currentSpacePages?.value?.rootPages?.data);
  parentPages.value = currentSpacePages?.value?.rootPages?.data;
  console.log(parentPages.value);
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
  expanded.value.push(treePages.value[0].label);
  selected.value = treePages.value[0].label;
  console.log(treePages.value[0].label);
});
</script>
