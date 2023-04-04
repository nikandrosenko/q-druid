<template>
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
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { getGroupSubjects } from "src/graphql/queries";
import TreeMenu from "./TreeMenu.vue";
import SubjectsList from "./SubjectsList.vue";

const { page } = defineProps({
  page: Object,
});

const { result: subjects } = useQuery(getGroupSubjects, {
  group_id: page?.object?.id,
});

// console.log(typeof page, page);

const showChildren = ref(false);

const isSubjects = computed(() => subjects.value?.get_group.subject.length);

const isChildrens = computed(() => page.children?.data.length);

const dropDownIconClass = computed(() =>
  (isSubjects.value || isChildrens.value) && showChildren.value
    ? "icon text-h6 drop-down-icon-rotated"
    : "icon text-h6 drop-down-icon"
);

const childrenItemsClass = computed(() =>
  (isSubjects.value || isChildrens.value) && showChildren.value
    ? "ml-md children-wrapper-expanded"
    : "ml-md children-wrapper-collapsed"
);

const toggleShowChildren = () => {
  showChildren.value = !showChildren.value;
};

const routeName = () =>
  page.object?.type_id === subjects.value?.get_group.type_id ? "group" : "page";
</script>

<style lang="scss">
a {
  text-decoration: none;
  color: #000;
}
.children-wrapper {
  overflow: hidden;
}
.children-wrapper-collapsed {
  @extend .children-wrapper;
  max-height: 0;
  transition: max-height 0.35s ease-out;
}
.children-wrapper-expanded {
  @extend .children-wrapper;
  max-height: 999px;
  transition: max-height 0.67s ease-in;
}
.drop-down-icon {
  transition: transform 0.37s ease-in;
}
.drop-down-icon-rotated {
  transition: transform 0.37s ease-out;
  transform: rotate(90deg);
}
</style>
