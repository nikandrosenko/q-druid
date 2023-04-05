<template>
<div class="flex justify-center content-center">

  <div class="wrapper-page">
    <q-tabs align="center">
          <q-tab
            exact
            label="Авторизация"
            class="montserrat-700"
            v-ripple
            @click="swipeReg=true"
          />
          <q-tab
            exact
            label="Регистрация"
            class="montserrat-700"
            v-ripple
            @click="swipeReg=false"
          />
        </q-tabs>
    <Auth v-if="swipeReg"/>
    <Reg v-else/>
  </div>

</div>

</template>

<script setup>
import Auth from 'src/components/Auth.vue';
import Reg from 'src/components/Reg.vue'
import { ref } from 'vue';
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";

const swipeReg = ref(true)

provideApolloClient(apolloClient);
</script>

<style lang="scss">
  .wrapper-page{
    border: 1px solid rgba(0, 0, 0, 0.445);
    border-radius: 25px;
    height: 450px;
    width: 60%;
    display: flex;
    flex-direction: column;
  }
</style>
