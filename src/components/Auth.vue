<template>
  <div class="flex column items-center">
    <form @submit.prevent="signIn">
      <div>
        <p>Почта</p>
        <q-input
          standout="bg-teal text-white"
          v-model="emailModel"
          label="Почта"
        />
      </div>

      <div>
        <p>Пароль</p>
        <q-input
          standout="bg-teal text-white"
          v-model="passwordModel"
          label="Пароль"
        />
      </div>

      <q-btn color="teal" text-color="white" label="Войти" type="submit" />
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useMutation } from "@vue/apollo-composable";
// import gql from "graphql-tag";

const store = useStore();

const emailModel = ref("");
const passwordModel = ref("");

const signIn = async () => {
  const { mutate: signInUser } = useMutation(
    gql`
      mutation UserSignIn($input: UserSignInInput!) {
        userSignIn(input: $input) {
          recordId
          record {
            token_type
            expires_in
            access_token
            refresh_token
          }
          status
        }
      }
    `,
    {
      variables: {
        input: {
          login: emailModel.value,
          password: passwordModel.value,
        },
      },
    }
  );

  signInUser()
    .then((res) => {
      if (!res.errors) {
        store.dispatch("user/GET_USER");
        sessionStorage.setItem(
          "token",
          res.data.userSignIn.record.access_token
        );
        localStorage.setItem("userId", res.data.userSignIn.recordId);
        console.log({
          "Token: ": sessionStorage.token,
          "User ID: ": localStorage.userId,
        });
      } else {
        console.log(2);
      }
    })
    .catch((e) => {
      if (e) {
        console.log(e);
      }
    });

  // window.localStorage.setItem(key, value);
};
</script>
