<template>
  <div class="q-pa-lg">
    <q-skeleton width="300px" height="100px" type="text" v-if="loading" />
    <div v-else class="text-h3">
      {{ props.title }}
    </div>
    <q-skeleton height="200px" v-if="loading" />
    <q-list v-else class="row wrap">
      <q-item class="col-3 column">
        <div class="text-h6 text-bold q-mb-lg" v-if="props.groups?.length">
          Группы
        </div>
        <div class="q-mb-lg" v-for="(item, index) in props.groups" :key="index">
          {{ item.name }}
        </div>
      </q-item>
      <q-item class="col-3 column">
        <div class="text-h6 text-bold q-mb-lg" v-if="props.information?.length">
          Информация
        </div>

        <div
          class="q-mb-lg"
          v-for="(item, index) in props.information"
          :key="index"
        >
          {{ item.name }}
        </div>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  groups: Array,
  information: Array,
  loading: Boolean,
});
</script>
