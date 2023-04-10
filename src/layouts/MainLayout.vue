<template>
  <q-layout view="hHr LpR fFr">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Приложение на платформе Druid </q-toolbar-title>
        <q-btn
          round
          exact
          dense
          to="/auth"
          color="black"
          icon="account_circle"
          v-ripple
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <Tree />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive :key="$route.fullPath">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import Tree from "src/components/Tree.vue";
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";

provideApolloClient(apolloClient);

const miniState = ref(true);

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
