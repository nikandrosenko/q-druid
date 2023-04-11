<template>
  <div class="q-pa-md">
    <div class="q-ma-xl">
      <q-table :rows="rows" :columns="columns" row-key="name"/>
    </div>
<!--    <q-card class="my-card" flat bordered>-->
<!--      <q-markup-table>-->
<!--        <thead>-->
<!--          <tr>-->
<!--            <th class="text-left"><strong>Имя</strong></th>-->
<!--            <th class="text-left"><strong>Фамилия</strong></th>-->
<!--            <th class="text-left"><strong>Почта</strong></th>-->
<!--          </tr>-->
<!--        </thead>-->
<!--        <tbody v-for="user in tableUsers" :key="user.id">-->
<!--          <tr>-->
<!--            <td style="border: 1px solid gray">-->
<!--              {{ user.fullname.first_name }}-->
<!--            </td>-->
<!--            <td style="border: 1px solid gray">-->
<!--              {{ user.fullname.last_name }}-->
<!--            </td>-->
<!--            <td style="border: 1px solid gray">{{ user.email.email }}</td>-->
<!--          </tr>-->
<!--        </tbody>-->
<!--      </q-markup-table>-->
<!--    </q-card>-->
    <div class="q-pa-md q-gutter-sm">
      <q-btn
        label="Пригласить участника"
        color="primary"
        @click="prompt = true"
      />
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Пригласить участника</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              square
              dense
              v-model="req.name"
              autofocus
              placeholder="Имя"
              @keyup.enter="prompt = false"
              lazy-rules
              :rules="[required]"
            />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input
              dense
              v-model="req.surname"
              autofocus
              placeholder="Фамилия"
              @keyup.enter="prompt = false"
              lazy-rules
              :rules="[required]"
            />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input
              dense
              v-model="req.email"
              autofocus
              placeholder="Почта"
              @keyup.enter="prompt = false"
              lazy-rules
              :rules="[required]"
            />
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
import { useValidators } from "src/use/validators";

const { required } = useValidators();
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
const tableUsers = ref([]);;
const rows = ref();
const columns = [
  {
    name: "name",
    required: true,
    label: "Название",
    align: "left",
    format: (val) => `${val}`,
    sortable: true,
    field: (row) =>
      `${row.fullname.first_name}`,
  },
  {
    name: "last_name",
    label: "Фамилия",
    field: (row) =>
      `${row.fullname.last_name}`,
  },
  {
    name: "email",
    label: "Почта",
    field: (row) =>
      `${row.email.email}`,
  },
];

const { result: subjects, onResult } = useQuery(getGroupSubjects, {
  group_id: subjectId,
});

onResult(() => {
  tableUsers.value = subjects.value?.get_group.subject;
  rows.value = subjects.value?.get_group.subject.map((el) => ({
    ...el,
    index: el.id,
  }));
  console.log(rows.value)
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
