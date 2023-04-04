<!-- <template>
  <q-item class="q-pa-none column">
    <router-link :to="{ name: routeName(), params: { id: page.id } }">
    <q-item
      clickable
      class="cursor-pointer rounded-borders q-pa-sm flex items-center"
    >
      <div>
        <q-icon
          @click.prevent="toggleShowChildren"
          :class="dropDownIconClass"
          v-if="isSubjects || isChildrens"
          name="keyboard_arrow_right"
        />

        <q-icon v-if="page.icon" :name="page.icon" />

        {{ page.title }}
      </div>
    </q-item>
    </router-link>

    <q-item-section :class="childrenItemsClass">
      <div>
        <SubjectsList
          v-show="isSubjects"
          :subjects="subjects?.get_group.subject"
        />
        <TreeMenu v-show="isChildrens" :pages="page.children?.data" />
      </div>
    </q-item-section>
  </q-item>
</template> -->

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree :nodes="simple" node-key="label" no-connectors default-expand-all />
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { getGroupSubjects } from "src/graphql/queries";
import TreeMenu from "./TreeMenu.vue";
// import SubjectsList from "./SubjectsList.vue";

const { page } = defineProps({
  page: Object,
});

const childArray = ref([]);
const subjectArray = ref([]);

const { result: subjects } = useQuery(getGroupSubjects, {
  group_id: page?.object?.id,
});
console.log(subjects);

// console.log(typeof page, page);

const expanded = ref([page.title]);

const treeReq = (a) => {
  // if (a) {
  //   const node = {
  //     label: a.title,
  //     children: ,
  //   };
  // } else {
  // }
  // watch(
  //   subjects,
  //   (data) => {
  //     data.get_group.subject.forEach((e) => {
  //       const subj = {
  //         label: e.fullname.first_name,
  //       };
  //       console.log(subjects?.get_group);
  //     });
  //   },
  //   { deep: true }
  // );
};

const childrens = () => {
  page.children?.data.forEach((e) => {
    childArray.value.push(child);
  });
};
childrens();
const simple = [
  {
    label: page.title,
    children: childArray.value,
  },
];

// const showChildren = ref(false);

// const isSubjects = computed(() => subjects.value?.get_group.subject.length);

// const isChildrens = computed(() => page.children?.data.length);

// const dropDownIconClass = computed(() =>
//   (isSubjects.value || isChildrens.value) && showChildren.value
//     ? "icon text-h6 drop-down-icon-rotated"
//     : "icon text-h6 drop-down-icon"
// );

// const childrenItemsClass = computed(() =>
//   (isSubjects.value || isChildrens.value) && showChildren.value
//     ? "ml-md children-wrapper-expanded"
//     : "ml-md children-wrapper-collapsed"
// );

// const toggleShowChildren = () => {
//   showChildren.value = !showChildren.value;
// };

// const routeName = () =>
//   page.object?.type_id === subjects.value?.get_group.type_id ? "group" : "page";
</script>

<!-- <template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="simple"
      node-key="label"
      no-connectors
      v-model:expanded="expanded"
    />
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      expanded: ref([
        "Satisfied customers (with avatar)",
        "Good food (with icon)",
      ]),

      simple: [
        {
          label: "Satisfied customers (with avatar)",
          avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
          children: [
            {
              label: "Good food (with icon)",
              icon: "restaurant_menu",
              children: [
                { label: "Quality ingredients" },
                { label: "Good recipe" },
              ],
            },
            {
              label: "Good service (disabled node with icon)",
              icon: "room_service",
              disabled: true,
              children: [
                { label: "Prompt attention" },
                { label: "Professional waiter" },
              ],
            },
            {
              label: "Pleasant surroundings (with icon)",
              icon: "photo",
              children: [
                {
                  label: "Happy atmosphere (with image)",
                  img: "https://cdn.quasar.dev/img/logo_calendar_128px.png",
                },
                { label: "Good table presentation" },
                { label: "Pleasing decor" },
              ],
            },
          ],
        },
      ],
    };
  },
};
</script> -->
