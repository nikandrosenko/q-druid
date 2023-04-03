<template>
  <div class="flex column items-center">
    {{ store.getters["user/USER"].name }}
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { ApolloClient } from "@apollo/client/core";
import { getClientOptions } from "src/apollo/index";
import { provideApolloClient } from "@vue/apollo-composable";
import { useStore } from "vuex";

const store = useStore();

// const apolloClient = new ApolloClient(getClientOptions());

// function provideApolloClientFunction() {
//   provideApolloClient(apolloClient);
// }

// const getUser = async () => {
//   provideApolloClientFunction();

//   const { result, error } = useQuery(
//     gql`
//       query User($id: String!) {
//         user(id: $id) {
//           id
//           current_space_id
//           email
//           name
//           surname
//           registration_passed
//           socials
//           spaces
//           avatar
//           telegram_chat_id
//           updated_at
//           created_at
//           deleted_at
//         }
//       }
//     `,
//     {
//       id: localStorage.userId,
//     }
//   );
//   const user = computed(() => result.value?.user ?? []);
//   console.log(result);
//   console.log(user);
//   console.log(user.value?.name);
//   console.log({
//     "localStorage.userId: ": localStorage.userId,
//     "typeof(localStorage.userId)": typeof localStorage.userId,
//   });
//   if (error) {
//     console.log(error);
//   }
// };

onMounted(() => {
  // getUser();
  console.log(store.getters["user/USER"]);
});
</script>
