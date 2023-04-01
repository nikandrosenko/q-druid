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
import { ref, computed } from 'vue';
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { ApolloClient } from "@apollo/client/core";
import { getClientOptions } from "src/apollo/index";
import { provideApolloClient } from "@vue/apollo-composable";
import { useStore } from 'vuex'

const store = useStore()

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
		  "login": emailModel.value.toLowerCase(),
		  "password": passwordModel.value
      }
}
  })

  const token = computed(() => store.getters['moduleAuth/USER_AUTH'])

  signInUser().then(res => {
      if (!res.errors) {
        store.dispatch('moduleAuth/AUTH_USER_DATA_RESPONSE_TOKEN', res.data.userSignIn.record)
      } else {
        console.log(2)
      }
  })
  .catch(e => {
      if (e.graphQLErrors) {
          console.log(e.graphQLErrors)
      }
   })

}


</script>
