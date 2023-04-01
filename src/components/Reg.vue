<template>

<div class="flex justify-around q-mt-xs">
  <div @click="swipeRegPassword=1" :style="regIndicatorOne ? 'background: green' : 'background: white'" class="step">1</div>
  <div @click="swipeRegPassword=2" :style="regIndicatorEnd ? 'background: green' : 'background: white'" class="step">2</div>
  <div @click="swipeRegPassword=3" :style="regIndicatorEnd ? 'background: green' : 'background: white'" class="step">3</div>
</div>

<div class="flex column items-center" v-if="swipeRegPassword===1">
    <form @submit.prevent="signUp" >
      <div>
      <p>Имя</p>
      <q-input standout="bg-teal text-white" v-model="nameModel" label="Имя" />
    </div>

    <div>
      <p>Фамилия</p>
    <q-input  standout="bg-teal text-white" v-model="surnameModel" label="Фамилия" />
    </div>

    <div>
      <p>Почта</p>
    <q-input  standout="bg-teal text-white" v-model="emailModel" label="Почта" />
    </div>

    <q-btn color="teal" text-color="white" label="Зарегестрироваться" type="submit"/>
    </form>

  </div>

  <div class="flex column items-center" v-else-if="swipeRegPassword===2">
    <form @submit.prevent="userSignUpSetPassword">
      <div>
      <p>Код</p>
      <q-input standout="bg-teal text-white" v-model="codModel" label="Код" />
    </div>

    <div>
      <p>Пароль</p>
      <q-input standout="bg-teal text-white" v-model="passwordModel" label="Пароль" />
    </div>

    <q-btn color="teal" text-color="white" label="Отправить" type="submit"/>
    </form>

  </div>

  <div v-else-if="swipeRegPassword===3" class="flex justify-center">
    <p v-if="regIndicatorEnd">Регистрация успешно завершена</p>
    <p>Вы еще не выполнили все пункты регистрации</p>
  </div>

</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { ApolloClient } from "@apollo/client/core";
import { getClientOptions } from "src/apollo/index";
import { provideApolloClient } from "@vue/apollo-composable";

const apolloClient = new ApolloClient(getClientOptions());

function provideApolloClientFunction() {
  provideApolloClient(apolloClient);
}

onMounted(() => {
  if(localStorage.getItem('UserRegId')){
    swipeRegPassword.value = 2
  }
})

const nameModel = ref('')
const surnameModel = ref('')
const emailModel = ref('')
const codModel = ref()
const passwordModel = ref()

const swipeRegPassword = ref(1)

const regIndicatorOne = ref(false)
const regIndicatorEnd = ref(false)

const signUp = async () => {

  provideApolloClientFunction()

  const { mutate: signUpUser } = useMutation(gql`
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
}`,
  {
    variables: {
      "input": {
      "name": nameModel.value,
      "surname": surnameModel.value,
      "email": emailModel.value
	  }
}
  })

  signUpUser().then(res => {
      if (!res.errors) {
        swipeRegPassword.value = 2
        localStorage.setItem('UserRegId', res.data.userSignUp.record.id);
        regIndicatorOne.value = true
      } else {
        console.log(res.errors)
      }
  })
  .catch(e => {
      if (e.graphQLErrors) {
          console.log(e.graphQLErrors)
      }
   })

}

const userSignUpSetPassword = async () => {

provideApolloClientFunction()

const { mutate: userSignUpSetPassword } = useMutation(gql`
mutation UserSignUpSetPassword($input: UserSignUpSetPasswordInput!) {
  userSignUpSetPassword(input: $input) {
		status
  }
}`,
{
  variables: {
    "input": {
    "user_id": localStorage.getItem('UserRegId'),
		"code": codModel.value,
		"password": passwordModel.value
    }
	}
})

userSignUpSetPassword().then(res => {
  console.log(res.data)
    if (!res.errors) {
      swipeRegPassword.value = 3
      regIndicatorEnd.value = true
      localStorage.setItem('UserRegId', '');
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
  .step{
    height: 40px;
    width: 40px;
    border: 1px solid rgba(0, 0, 0, 0.466);
    border-radius: 25px;
    text-align: center;
    cursor: pointer;
  }
</style>
