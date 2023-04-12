<template>
  <q-dialog v-model="prompt">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Создать задачу</div>
      </q-card-section>
      <q-form @submit.prevent="taskCreate">
        <q-card-section class="q-pt-none">
        <q-input
          v-model="task.name"
          type="text"
          label="Название"
          lazy-rules
          :rules="[required]"
        />
        </q-card-section>
        <q-card-section class="q-pt-none">
        <q-input
          v-model="task.description"
          type="text"
          label="Описание"
          lazy-rules
          :rules="[required]"
        />
        </q-card-section>
        <q-card-section class="q-pt-none">
        <q-select
          v-model="task.executor"
          label="Исполнитель"
          :options="groupSubjectUsers"
          lazy-rules
          :rules="[required]"
        />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="'Отмена'" v-close-popup />
        <q-btn flat :label="'Создать задачу'" type="submit" v-close-popup
        />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <q-btn label="Создать задачу" color="primary" @click="prompt = true" />
</template>
<script setup>
import { useMutation, useQuery } from "@vue/apollo-composable";
import { ref, onMounted, computed } from "vue";
import { getExecutorGroupSubjects } from "src/graphql/queries";
import { createTask, createPermissionRule } from "src/graphql/mutations";
import { useValidators } from "src/use/validators.js";


const { required } = useValidators();
const { page } = defineProps({
  page: Object,
});

const prompt = ref(false);

const task = ref({
  name: "",
  description: "",
  executor: {
    label: "",
    value: "",
  },
});

const { result: executorGroupSubjectUsers } = useQuery(
  getExecutorGroupSubjects
);

const groupSubjectUsers = computed(() =>
  executorGroupSubjectUsers.value?.get_group.subject.map((subject) => ({
    label: `${subject.fullname.first_name} ${subject.fullname.last_name}`,
    value: subject.id,
  }))
);

const taskCreate = async () => {
  const { mutate: creatingTask } = useMutation(createTask);
  const { data: createdTask } = await creatingTask({
    input: {
      name: task.value.name,
      property1: task.value.description,
      property2: {
        [process.env.SUBJECT_ID]: task.value.executor.value,
      },
      property3: process.env.APPOINTED_ID,
      property4: {
        [process.env.MODULE_ID]: page.page.object.id,
      },
    },
  });
  const { mutate: creatingPermissionRule } = useMutation(createPermissionRule);
  const { data: createdPermissionRule } = await creatingPermissionRule({
    input: {
      model_type: "object",
      model_id: createdTask.create_type2.recordId,
      owner_type: "subject",
      owner_id: task.value.executor.value,
      level: 5,
    },
  });

  return {
    createdTask,
    createdPermissionRule,
  };
};
</script>
