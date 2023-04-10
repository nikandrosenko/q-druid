<template>
  <q-dialog v-model="prompt">
    <q-form style="min-width: 500px" @submit.prevent="taskCreate">
      <q-input v-model="taskName" type="text" label="Название" />
      <q-input v-model="taskDescription" type="text" label="Описание" />
      <q-select
        v-model="taskExecutor"
        label="Исполнитель"
        :options="groupSubjectUsers"
      />
      <q-btn color="primary" :label="'Создать задачу'" type="submit" />
    </q-form>
  </q-dialog>
  <q-btn label="Создать задачу" color="primary" @click="prompt = true" />
</template>
<script setup>
import { useMutation, useQuery } from "@vue/apollo-composable";
import { ref, onMounted, computed } from "vue";
import { getExecutorGroupSubjects, getModuleById } from "src/graphql/queries";
import { createTask } from "src/graphql/mutations";
const prompt = ref(false);
const taskName = ref("");
const taskDescription = ref("");
const taskExecutor = ref("");

//   name: "",
//   description: "",
//   executor: {
//     label: "",
//     value: "",
//   },
// });

const { result: executorGroupSubjectUsers } = useQuery(
  getExecutorGroupSubjects
);
const { result: resultModule, refetch: refetchModule } = useQuery(
  getModuleById,
  {
    module_id: page.object.id,
  }
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
      name: taskName.value,
      property1: taskDescription.value,
      property2: {
        [process.env.SUBJECT_ID]: taskExecutor.value.value,
      },
      property3: [process.env.APPOINTED_ID],
      property4: {
        [process.env.MODULE_ID]: moduleId, // Доделать
      },
    },
  });

  const { data: createdPermissionRule } = await creatingPermissionRule({
    input: {
      model_type: "object",
      model_id: createdTask.create_type2.recordId,
      owner_type: "subject",
      owner_id: taskExecutor.value,
      level: 5,
    },
  });

  await refetchModule({
    module_id: moduleId,
  });

  return {
    createdTask,
    createdPermissionRule,
  };
};
</script>
