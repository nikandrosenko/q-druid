<template>
  <q-layout view="hHh Lpr fFf">
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

      <q-tabs align="right">
        <q-route-tab
          exact
          to="/Auth"
          label="Вход"
          class="montserrat-700"
          v-ripple
        />
        <q-route-tab
          exact
          to="/TreeTest"
          label="Тест"
          class="montserrat-700"
          v-ripple
        />
      </q-tabs>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <!-- <q-item-label header> Будущая древовидная навигация </q-item-label> -->
        <TreeMenu :pages="currentSpacePages?.rootPages?.data" />
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

const { result: currentSpacePages } = useQuery(pages);
// console.log(currentSpacePages);

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
