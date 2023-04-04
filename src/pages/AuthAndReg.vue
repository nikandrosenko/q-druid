<template>
  <div class="fullscreen row items-center justify-evenly">
    <Auth />
    <Reg />
  </div>
</template>

<script setup>
import Auth from "src/components/Auth.vue";
import Reg from "src/components/Reg.vue";
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";
provideApolloClient(apolloClient);
</script>
