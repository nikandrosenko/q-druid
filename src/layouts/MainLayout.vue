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

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>

      <q-tabs align="right"  v-if="token.length === 0">
        <q-route-tab
          exact
          to="/Auth"
          label="Регистрация/Авторизация"
          class="montserrat-700"
          v-ripple
        />
      </q-tabs>
      <q-tabs align="right" v-else>
        <q-route-tab
          exact
          to="/Profile"
          label="Профиль"
          class="montserrat-700"
          v-ripple
        />
      </q-tabs>

    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex';

const store = useStore()

const token = computed(() => store.state.moduleAuth.userAuth)

    const leftDrawerOpen = ref(false)

    const toggleLeftDrawer = () => {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
</script>
