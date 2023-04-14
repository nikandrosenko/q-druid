<template>
  <div>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div v-if="props.updateData.updateCreateType.bool" class="text-h6">
          Создать задачу
        </div>
        <div v-else class="text-h6">Изменить задачу</div>
      </q-card-section>
      <q-form @submit.prevent="manipulationForm">
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
            :rules="[requiredSelect]"
          />
        </q-card-section>
        <q-card-section
          class="q-pt-none"
          v-if="!props.updateData.updateCreateType.bool"
        >
          <q-select
            v-model="taskStatus"
            label="Статус"
            :options="statusTaskList"
            lazy-rules
            :rules="[requiredSelect]"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="'Отмена'" v-close-popup />
          <q-btn
            flat
            :label="
              props.updateData.updateCreateType.bool
                ? 'Создать задачу'
                : 'Изменить задачу'
            "
            type="submit"
            v-close-popup
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { useQuery } from "@vue/apollo-composable";
import { ref, computed } from "vue";
import { getExecutorGroupSubjects } from "src/graphql/queries";
import { useValidators, useValidatorsSelect } from "src/use/validators.js";
import taskMutation from "src/sdk/tasks.js";

const { required } = useValidators();
const { requiredSelect } = useValidatorsSelect();
const taskStatus = ref(props.updateData.moduleStatusUpdate);
const statusTaskList = [
  // {
  //   label: 'Назначено',
  //   value: process.env.APPOINTED_ID
  // },
  {
    label: "Выполнено",
    value: process.env.COMPLETED_ID,
  },
  {
    label: "Завершено",
    value: process.env.FINISHED_ID,
  },
];
const props = defineProps({
  page: Object,
  updateData: Object,
});
const task = ref({
  name: props.updateData.moduleNameUpdate,
  description: props.updateData.moduleDescriptionUpdate,
  executor: props.updateData.modelUserModuleUpdate,
  status: taskStatus,
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
const taskCreating = () => {
  taskMutation.taskCreate(task.value, props.page.page.object.id);
};
const taskUpdating = () => {
  taskMutation.taskUpdate(task.value, props.updateData.updateCreateType.id);
};
const manipulationForm = () => {
  if (props.updateData.updateCreateType.bool) {
    taskCreating();
  } else {
    taskUpdating();
  }
};
</script>
