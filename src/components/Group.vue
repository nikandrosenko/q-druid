<template>
  <div class="q-ma-xl">
    <div>
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
    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="name"/>
    </div>
  </div>
</template>
<script setup>
import { useQuery, useMutation } from "@vue/apollo-composable";
import { getGroupSubjects } from "src/graphql/queries";
import { ref, onMounted } from "vue";
import { userGroupInviteUser } from "src/graphql/mutations";
import { useValidators } from "src/use/validators.js";
import { useQuasar } from "quasar";

const { page, subjectId, id } = defineProps({
  page: Object,
  subjectId: String,
  id: String,
});

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

const $q = useQuasar();

const { required } = useValidators();

const prompt = ref(false);

const tableUsers = ref([]);

const {
  result: subjects,
  onResult,
  refetch,
} = useQuery(getGroupSubjects, {
  group_id: subjectId,
});

onResult(() => {
  rows.value = subjects.value?.get_group.subject.map((el) => ({
    ...el,
    index: el.id,
  }));
});

const req = ref({
  email: "",
  name: "",
  surname: "",
});

const resetForm = () => {
  (req.value.email = ""), (req.value.surname = ""), (req.value.name = "");
};

const { mutate: inviteUser } = useMutation(userGroupInviteUser);
const userInvite = async () => {
  const { data } = await inviteUser({
    input: {
      email: req.value.email,
      name: req.value.name,
      surname: req.value.surname,
      page_group_id: id,
    },
  });

  return data;
};
const onSubmit = async () => {
  try {
    await userInvite();
    $q.notify({
      type: "positive",
      message: "Пользователь приглашён",
    });
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  refetch();
});
</script>
