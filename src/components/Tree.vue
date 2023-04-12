<template>
  <q-list>
    <q-tree
      :nodes="keyedPages"
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
import { ref, onMounted, watch } from "vue";
import { pages } from "src/graphql/queries";
import { useQuery } from "@vue/apollo-composable";
import { useRouter, useRoute } from "vue-router";
import _ from "lodash";

const router = useRouter();
const route = useRoute();
const id = ref("");
const treePages = ref([]);
const keyedPages = ref([]);
const parentPages = ref([]);
const selected = ref();
const expanded = ref([]);

const myclick = (node) => {
  router.push({
    name: "page",
    params: { id: node.id },
  });
};

const { result: currentSpacePages, onResult, refetch } = useQuery(pages);

// const treeCreate = async () => {
//   const treeData = await currentSpacePages.value;
//   console.log(treeData);
// };
onResult(() => {
  parentPages.value = currentSpacePages?.value?.rootPages?.data;
  parentPages.value.forEach((page) => {
    let treeElem = {
      id: page.id,
      label: page.title,
      icon: page.icon,
      position: page.position,
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
  keyedPages.value = _.sortBy(treePages.value, ["label", "position"]);
  // selected.value = keyedPages.value[0].label;
  // console.log(keyedPages.value);
  // console.log(id.value);
  selected.value = keyedPages.value[0].label;
  // console.log(
  //   _.find(keyedPages.value, (o) => {
  //     return o.children[0].id === route.params.id;
  //   })
  // );
  expanded.value.push(selected.value);
});
onMounted(() => {
  // treeCreate();
  if (!currentSpacePages) refetch();
});
// watch(currentSpacePages, () => {
//   refetch();
// });
</script>
