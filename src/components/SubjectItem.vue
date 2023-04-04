<template>
  <router-link :to="{ name: 'subject', params: { id: subject.id } }">
    <q-item
      clickable
      class="flex items-center q-pa-sm rounded-borders cursor-pointer"
    >
      <q-icon size="1.6em" class="invisible" />
      <q-icon name="list_alt" size="1.6em" />

      <q-item-section class="q-ml-sm">
        {{ subject?.fullname?.first_name }} {{ subject?.fullname?.last_name }}
      </q-item-section>
    </q-item>
  </router-link>
</template>

<script setup>
const { subject } = defineProps({
  subject: Object,
});
</script>
