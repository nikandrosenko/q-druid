<template>
  <q-item class="q-pa-none column">
    <router-link :to="{ name: routeName(), params: { id: page.id } }">
      <q-item
        clickable
        class="cursor-pointer rounded-borders q-pa-sm flex items-center"
      >
        <div class="flex items-center">
          <q-icon
            @click.prevent="toggleShowChildren"
            :class="dropDownIconClass"
            v-if="isSubjects || isChildrens"
            name="keyboard_arrow_right"
          />

          <q-icon size="1.6em" v-if="page.icon" :name="page.icon" />
          <q-item-section class="q-ml-sm">
            {{ page.title }}
          </q-item-section>
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
import { computed, ref } from "vue";
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
console.log(page);
const showChildren = ref(false);

const isSubjects = computed(() => subjects.value?.get_group.subject.length);
const isChildrens = computed(() => page.children?.data.length);

const dropDownIconClass = computed(() =>
  (isSubjects.value || isChildrens.value) && showChildren.value
    ? "icon text-h6 drop-down-icon__rotated"
    : "icon text-h6 drop-down-icon"
);
const childrenItemsClass = computed(() =>
  (isSubjects.value || isChildrens.value) && showChildren.value
    ? "q-ml-lg children-wrapper__collapsed"
    : "q-ml-lg children-wrapper__expanded"
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
  &__collapsed {
    @extend .children-wrapper;
    max-height: 0;
    transition: max-height 0.3s ease-out;
  }
  &__expanded {
    @extend .children-wrapper;
    max-height: 999px;
    transition: max-height 0.6s ease-in;
  }
}
.drop-down-icon {
  transition: transform 0.3s ease-in;
  &__rotated {
    transition: transform 0.3s ease-out;
    transform: rotate(90deg);
  }
}
</style>
