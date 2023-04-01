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

    <div id="buttonDiv"></div>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { ApolloClient } from "@apollo/client/core";
import { getClientOptions } from "src/apollo/index";
import { provideApolloClient } from "@vue/apollo-composable";
import { useStore } from 'vuex'


const store = useStore()
const router = useRouter()

  const handleCredentialResponse = (response) => {
          console.log("Encoded JWT ID token: " + response.credential);
          signInFromGoogle(String(response.credential))
        }

        onMounted(() => {
        google.accounts.id.initialize({
          client_id: "657923009459-arg62iseulaj74kosjp2ntv41268o5pq.apps.googleusercontent.com",
          callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
          document.getElementById("buttonDiv"),
            { theme: "outline", size: "large" }  // customization attributes
          );

          google.accounts.id.prompt(); // also display the One Tap dialog
        }
        )

        const routProfile = () => {
        router.replace({ path: '/' })
      }

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

  signInUser().then(res => {
      if (!res.errors) {
        store.dispatch('moduleAuth/AUTH_USER_DATA_RESPONSE_TOKEN', res.data.userSignIn.record)
        routProfile()
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

const signInFromGoogle = async (JWTTokenGoogle) => {

provideApolloClientFunction()

const { mutate: signInUser } = useMutation(gql`
mutation UserSignInSocialNetwork($input: UserSignInSocialNetworkInput!) {
  userSignInSocialNetwork(input: $input) {
    recordId
		record {
			token_type
			expires_in
			access_token
		}
		status
  }
}`,
{
  variables: {
    "input": {
		"access_token": JWTTokenGoogle,
		"network": "google"
	}
}
})

signInUser().then(res => {
    if (!res.errors) {
      store.dispatch('moduleAuth/AUTH_USER_DATA_RESPONSE_TOKEN', res.data.userSignIn.record)
      routProfile()
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

<style lang="scss">
  #buttonDiv{
    width: 200px;
  }
</style>
