<template>
  <div class="flex column items-center">
    <form @submit.prevent="signUp">
      <div>
        <p>Имя</p>
        <q-input
          standout="bg-teal text-white"
          v-model="nameModel"
          label="Имя"
        />
      </div>
      <div>
        <p class="q-mt-md">Фамилия</p>
        <q-input
          standout="bg-teal text-white"
          v-model="surnameModel"
          label="Фамилия"
        />
      </div>
      <div>
        <p class="q-mt-md">Почта</p>
        <q-input
          standout="bg-teal text-white"
          v-model="emailModel"
          label="Почта"
        />
      </div>
      <q-btn
        class="q-mt-md"
        color="teal"
        text-color="white"
        label="Зарегистрироваться"
        type="submit"
      />
    </form>
  </div>
  <div class="flex column items-center">
    <form @submit.prevent="userSignUpSetPassword">
      <div>
        <p>Код</p>
        <q-input standout="bg-teal text-white" v-model="codModel" label="Код" />
      </div>
      <div>
        <p class="q-mt-md">Пароль</p>
        <q-input
          class="q-mt-md"
          standout="bg-teal text-white"
          v-model="passwordModel"
          label="Пароль"
        />
      </div>
      <q-btn
        class="q-mt-md"
        color="teal"
        text-color="white"
        label="Отправить"
        type="submit"
      />
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { ApolloClient } from "@apollo/client/core";
import { getClientOptions } from "src/apollo/index";
import { provideApolloClient } from "@vue/apollo-composable";

const apolloClient = new ApolloClient(getClientOptions());

function provideApolloClientFunction() {
  provideApolloClient(apolloClient);
}

const nameModel = ref("");
const surnameModel = ref("");
const emailModel = ref("");
const codModel = ref();
const passwordModel = ref();

const signUp = async () => {
  provideApolloClientFunction();

  const { mutate: signUpUser } = useMutation(
    gql`
      mutation UserSignUp($input: UserSignUpInput!) {
        userSignUp(input: $input) {
          recordId
          record {
            id
            email
            registration_passed
            name
            surname
          }
          status
        }
      }
    `,
    {
      variables: {
        input: {
          name: nameModel.value,
          surname: surnameModel.value,
          email: emailModel.value,
        },
      },
    }
  );

  signUpUser()
    .then((res) => {
      console.log(res.data);
      if (!res.errors) {
        localStorage.setItem("UserRegId", res.data.userSignUp.record.id);
      } else {
        console.log(res.errors);
      }
    })
    .catch((e) => {
      if (e.graphQLErrors) {
        console.log(e.graphQLErrors);
      }
    });
};

const userSignUpSetPassword = async () => {
  provideApolloClientFunction();

  const { mutate: userSignUpSetPassword } = useMutation(
    gql`
      mutation UserSignUpSetPassword($input: UserSignUpSetPasswordInput!) {
        userSignUpSetPassword(input: $input) {
          status
        }
      }
    `,
    {
      variables: {
        input: {
          user_id: localStorage.getItem("UserRegId"),
          code: codModel.value,
          password: passwordModel.value,
        },
      },
    }
  );

  userSignUpSetPassword()
    .then((res) => {
      console.log(res.data);
      if (!res.errors) {
        console.log(!res.errors);
      } else {
        console.log(2);
      }
    })
    .catch((e) => {
      if (e.graphQLErrors) {
        console.log(e.graphQLErrors);
      }
    });
};
</script>
