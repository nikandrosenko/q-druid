<template>
  <div class="q-pa-md">
    <q-card style="border: 1px solid gray" class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h6">{{ page?.page.title }}</div>
      </q-card-section>
      <q-markup-table>
        <thead>
          <tr>
            <th style="border: 1px solid gray" class="text-left">Имя</th>
            <th style="border: 1px solid gray" class="text-left">Фамилия</th>
            <th style="border: 1px solid gray" class="text-left">Почта</th>
          </tr>
        </thead>
        <tbody v-for="user in tableUsers" :key="user.id">
          <tr>
            <td style="border: 1px solid gray">{{ user.fullname.first_name }}</td>
            <td style="border: 1px solid gray">{{ user.fullname.last_name }}</td>
            <td style="border: 1px solid gray">{{ user.email.email }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card>
    <div class="q-pa-md q-gutter-sm">
      <q-btn label="Пригласить участника" color="primary" @click="prompt = true" />
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Пригласить участника</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input square dense v-model="req.name" autofocus placeholder="Имя" @keyup.enter="prompt = false" />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input dense v-model="req.surname" autofocus placeholder="Фамилия" @keyup.enter="prompt = false" />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input dense v-model="req.email" autofocus placeholder="Почта" @keyup.enter="prompt = false" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Отмена" v-close-popup />
            <q-btn flat label="Пригласить" @click="onSubmit" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script setup>
import { useQuery, useMutation } from "@vue/apollo-composable";
import { getPage, getGroupSubjects } from "src/graphql/queries";
import { useRoute } from "vue-router/dist/vue-router";
import { computed, ref, onMounted } from "vue";
import { userGroupInviteUser } from "src/graphql/mutations";

const id = ref("");
const route = useRoute();
const prompt = ref(false);

const defId = () => {
  id.value = route.params.id;
};

const { result: page } = useQuery(getPage, {
  id: id,
});

const subjectId = computed(() => page.value?.page?.object.id);
const tableUsers = ref([]);

const { result: subjects, onResult } = useQuery(getGroupSubjects, {
  group_id: subjectId,
});

onResult(() => {
  tableUsers.value = subjects.value?.get_group.subject;
});

const req = ref({
  email: "",
  name: "",
  surname: "",
});

const resetForm = () => {
  (req.value.email = ""), (req.value.surname = ""), (req.value.name = "");
};
const { mutate: onSubmit } = useMutation(userGroupInviteUser, {
  input: {
    email: req.value.email,
    name: req.value.name,
    surname: req.value.surname,
    page_group_id: id.value,
  },
});
onMounted(() => {
  defId();
});
</script>
