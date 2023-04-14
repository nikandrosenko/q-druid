<template>
  <div style="height: 700px" class="flex justify-center content-center">
    <div class="q-pa-md q-gutter-md absolute-left">
      <q-btn color="primary" exacts to="/">
        <q-icon left size="1.5em" name="arrow_back" />
        <div>Назад</div>
      </q-btn>
    </div>
    <div class="wrapper-page">
      <q-tabs align="center">
        <q-tab
          exact
          label="Авторизация"
          class="montserrat-700"
          v-ripple
          @click="swipeReg = true"
        />
        <q-tab
          exact
          label="Регистрация"
          class="montserrat-700"
          v-ripple
          @click="swipeReg = false"
        />
      </q-tabs>

      <Auth v-if="swipeReg" />
      <Reg v-else />
    </div>
  </div>
</template>

<script setup>
import Auth from "src/components/Auth.vue";
import Reg from "src/components/Reg.vue";
import { ref } from "vue";
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";

const swipeReg = ref(true);

provideApolloClient(apolloClient);
</script>

<style lang="scss">
.wrapper-page {
  border: 1px solid rgba(0, 0, 0, 0.445);
  border-radius: 25px;
  max-height: 600px;
  width: 60%;
  display: flex;
  flex-direction: column;
  padding: 30px 0 30px 0;
}
</style>
