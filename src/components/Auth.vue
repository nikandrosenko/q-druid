<template>
  <div class="flex column items-center">
    <form @submit.prevent="signIn">
      <div>
        <p>Почта</p>
        <q-input
          standout="bg-teal text-white"
          v-model="emailModel"
          type="email"
          label="Почта"
        />
      </div>
      <div>
        <p class="q-mt-md">Пароль</p>
        <q-input
          standout="bg-teal text-white"
          v-model="passwordModel"
          type="password"
          label="Пароль"
        />
      </div>
      <q-btn
        class="q-mt-md"
        color="teal"
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
import { useStore } from "vuex";
import { userSignIn, userSignInSocialNetwork } from "src/graphql/mutations.js";

const store = useStore();
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

  google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "outline", size: "large" } // customization attributes
  );

  google.accounts.id.prompt(); // also display the One Tap dialog
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
