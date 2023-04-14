<template>
  <q-list>
    <q-tree
      v-if="keyedPages"
      :nodes="keyedPages"
      node-key="id"
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
import { ref, onMounted } from "vue";
import { pages } from "src/graphql/queries";
import { useQuery } from "@vue/apollo-composable";
import { useRouter, useRoute } from "vue-router";
import _ from "lodash";

const router = useRouter();
const route = useRoute();
const treePages = ref([]);
const keyedPages = ref([]);
const parentPages = ref([]);
const selected = ref();
const expanded = ref([]);

const redirect = (node) => {
  router.push({
    name: "page",
    params: { id: node.id },
  });
};

const { result: currentSpacePages, onResult, refetch } = useQuery(pages);

onResult(() => {
  treePages.value = [];
  parentPages.value = currentSpacePages?.value?.rootPages?.data;
  parentPages.value.forEach((page) => {
    let treeElem = {
      id: page.id,
      label: page.title,
      icon: page.icon,
      position: page.position,
      handler: (node) => redirect(node),
      children: page.children.data.map((elem) => {
        elem = {
          id: elem.id,
          label: elem.title,
          icon: elem.icon,
          handler: (node) => redirect(node),
        };
        return elem;
      }),
    };
    treePages.value.push(treeElem);
  });
  keyedPages.value = _.sortBy(treePages.value, ["label", "position"]);

  const findById = (array, id) => {
    let result;
    array.some(
      (o) => (result = o.id === id ? o : findById(o.children || [], id))
    );
    return result;
  };

  selected.value = findById(keyedPages.value, route.params.id)?.id ?? "";
  if (selected.value !== "") {
    expanded.value.push(
      keyedPages.value.find(
        (item) =>
          item.id === route.params.id ||
          item.children.find((i) => i.id === route.params.id)
      ).id
    );
  }
});
onMounted(() => {
  refetch();
});
</script>
