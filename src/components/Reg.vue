<template>

<div class="flex column items-center" v-if="swipeRegPassword===1">
    <form @submit.prevent="signUp" >
      <div>
        <p style="margin: 30px 0 5px;">Имя</p>
        <q-input
          standout="bg-primary text-white"
          v-model="nameModel"
          label="Имя"
        />
      </div>
      <div>
        <p style="margin: 16px 0 5px;" class="q-mt-md">Фамилия</p>
        <q-input
          standout="bg-primary text-white"
          v-model="surnameModel"
          label="Фамилия"
        />
      </div>
      <div>
        <p style="margin: 16px 0 5px;" class="q-mt-md">Почта</p>
        <q-input
          standout="bg-primary text-white"
          v-model="emailModel"
          label="Почта"
        />
      </div>
      <q-btn
        style="margin-top: 30px;"
        class="q-mt-md"
        color="primary"
        text-color="white"
        label="Зарегистрироваться"
        type="submit"
      />
    </form>
  </div>

  <div class="flex column items-center" v-else-if="swipeRegPassword===2">
    <form @submit.prevent="userSignUpSetPass">
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
        color="primary"
        text-color="white"
        label="Отправить"
        type="submit"
      />
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
import { userSignUp, userSignUpSetPassword } from 'src/graphql/mutations.js'

onMounted(() => {
  if(localStorage.getItem('UserRegId')){
    swipeRegPassword.value = 1
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

  const { mutate: signUpUser } = useMutation(userSignUp,
  {
    variables: {
      input: {
      name: nameModel.value,
      surname: surnameModel.value,
      email: emailModel.value
	  }
}
  })

  signUpUser().then(res => {
      if (!res.errors) {
        swipeRegPassword.value = 2
        localStorage.setItem('UserRegId', res.data.userSignUp.record.id);
        regIndicatorOne.value = true
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

const userSignUpSetPass = async () => {

  const { mutate: userSignUpSecondStep } = useMutation(userSignUpSetPassword,
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

  userSignUpSecondStep().then(res => {
  console.log(res.data)
    if (!res.errors) {
      localStorage.setItem('UserRegId', '');
      swipeRegPassword.value = 3
      regIndicatorEnd.value = true
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
