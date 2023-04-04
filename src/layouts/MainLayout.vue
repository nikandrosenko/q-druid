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
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <TreeMenu :pages="currentSpacePages?.rootPages?.data" />
      </q-list>
    </q-drawer>
    <q-drawer side="right" :mini="miniState" show-if-above bordered>
      <q-list class="column q-mt-sm items-center">
        <q-btn
          round
          exact
          to="/auth"
          color="primary"
          icon="account_circle"
          v-ripple
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import TreeMenu from "src/components/TreeMenu.vue";
import { provideApolloClient, useQuery } from "@vue/apollo-composable";
import { pages } from "src/graphql/queries";
import apolloClient from "src/apollo/client";

provideApolloClient(apolloClient);

const miniState = ref(true);

const { result: currentSpacePages } = useQuery(pages);

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
