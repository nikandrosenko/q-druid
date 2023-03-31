<template>
  <div class="flex column items-center">
    <form @submit.prevent="signIn">
      <div>
      <p>Почта</p>
      <q-input standout="bg-teal text-white" v-model="emailModel" label="Почта" />
    </div>

    <div>
      <p>Пароль</p>
    <q-input  standout="bg-teal text-white" v-model="passwordModel" label="Пароль" />
    </div>

    <q-btn color="teal" text-color="white" label="Войти" type="submit"/>
    </form>

  </div>

</template>

<script setup>
import { ref } from 'vue';
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { ApolloClient } from "@apollo/client/core";
import { getClientOptions } from "src/apollo/index";
import { provideApolloClient } from "@vue/apollo-composable";

const apolloClient = new ApolloClient(getClientOptions());

function provideApolloClientFunction() {
  provideApolloClient(apolloClient);
}

const emailModel = ref('')
const passwordModel = ref('')

const signIn = async () => {

  provideApolloClientFunction()

  const { mutate: signInUser } = useMutation(gql`
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
}`,
  {
    variables: {
      "input": {
		  "login": emailModel.value,
		  "password": passwordModel.value
      }
}
  })



  signInUser().then(res => {
      if (!res.errors) {
        localStorage.setItem('Token', res.data.userSignIn.record.token_type);
        console.log(localStorage.getItem('Token'))
      } else {
        console.log(2)
      }
  })
  .catch(e => {
      if (e.graphQLErrors) {
          console.log(e.graphQLErrors)
      }
   })

  // window.localStorage.setItem(key, value);
}


</script>
