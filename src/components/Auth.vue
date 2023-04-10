<template>
  <div class="flex column items-center">
    <form @submit.prevent="signIn">
      <div>
        <p style="margin: 30px 0 5px;">Почта</p>
        <q-input
          standout="bg-primary text-white"
          v-model="emailModel"
          type="email"
          label="Почта"
          lazy-rules
          :rules="[required]"
        />
      </div>
      <div>
        <p style="margin: 16px 0 5px;" class="q-mt-md" >Пароль</p>
        <q-input
          standout="bg-primary text-white"
          v-model="passwordModel"
          type="password"
          label="Пароль"
          lazy-rules
          :rules="[required]"
        />
      </div>
      <q-btn
        style="margin: 20px 0 20px 0;"
        class="q-mt-md"
        color="primary"
        text-color="white"
        label="Войти"
        type="submit"
      />
    </form>

    <div id="buttonDiv"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import { userSignIn, userSignInSocialNetwork } from "src/graphql/mutations.js";
import { useValidators } from "src/use/validators.js";

const { required } = useValidators();
const router = useRouter();

const handleCredentialResponse = (response) => {
  console.log("Encoded JWT ID token: " + response.credential);
  signInFromGoogle(String(response.credential));
};

onMounted(() => {
  google.accounts.id.initialize({
    client_id:
      "657923009459-arg62iseulaj74kosjp2ntv41268o5pq.apps.googleusercontent.com",
    callback: handleCredentialResponse,
  });

  google.accounts.id.renderButton(document.getElementById("buttonDiv"), {
    theme: "outline",
    size: "large",
  });

  google.accounts.id.prompt();
});

const routProfile = () => {
  router.replace({ name: "home" });
};

const emailModel = ref("");
const passwordModel = ref("");

const signIn = async () => {
  const { mutate: signInUser } = useMutation(userSignIn, {
    variables: {
      input: {
        login: emailModel.value.toLowerCase(),
        password: passwordModel.value,
      },
    },
  });

  signInUser()
    .then((res) => {
      if (!res.errors) {
        console.log(res.data.userSignIn);
        localStorage.setItem("userId", res.data.userSignIn.recordId);
        sessionStorage.setItem(
          "token",
          res.data.userSignIn.record.access_token
        );
        routProfile();
      } else {
        console.log(2);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const signInFromGoogle = async (JWTTokenGoogle) => {
  const { mutate: signInUserSocialNetwork } = useMutation(
    userSignInSocialNetwork,
    {
      variables: {
        input: {
          access_token: JWTTokenGoogle,
          network: "google",
        },
      },
    }
  );
  signInUserSocialNetwork()
    .then((res) => {
      if (!res.errors) {
        localStorage.setItem("userId", res.data.userSignIn.recordId);
        sessionStorage.setItem(
          "token",
          res.data.userSignIn.record.access_token
        );
        routProfile();
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

<style lang="scss">
#buttonDiv {
  width: 200px;
}
</style>
