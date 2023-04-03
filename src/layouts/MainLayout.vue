<template>
  <q-layout view="lHh Lpr lFf">
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

      <q-tabs align="left">
        <q-route-tab
          exact
          to="/Auth"
          label="Регистрация/Авторизация"
          class="montserrat-700"
          v-ripple
        />
        <q-route-tab
          exact
          to="/User"
          label="Пользователь"
          class="montserrat-700"
          v-ripple
        />
      </q-tabs>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Будущая древовидная навигация </q-item-label>
        <Tree />
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
import Tree from "src/components/Tree.vue";
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";

provideApolloClient(apolloClient);

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
