<template>
  <div>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Изменить задачу</div>
      </q-card-section>
      <q-form @submit.prevent="manipulationForm">
        <q-card-section class="q-pt-none">
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
          <q-btn flat :label="'Изменить задачу'" type="submit" v-close-popup />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useValidators, useValidatorsSelect } from "src/use/validators.js";
import tasksMutation from 'src/sdk/tasks.js'

const { required } = useValidators();
const { requiredSelect } = useValidatorsSelect();
const taskStatus = ref(props.updateData.moduleStatusUpdate)
const statusTaskList =  [
  {
    label: 'Назначено',
    value: process.env.APPOINTED_ID
  },
  {
    label: 'Выполнено',
    value: process.env.COMPLETED_ID
  },
  {
    label: 'Завершено',
    value: process.env.FINISHED_ID
  }
]
const props = defineProps({
  updateData: Object
});
const task = ref({
  name: props.updateData.moduleNameUpdate,
  description: props.updateData.moduleDescriptionUpdate,
  executor: props.updateData.modelUserModuleUpdate,
  status: taskStatus,
});

const taskUpdating = () => {

tasksMutation.taskUpdate(task.value, props.updateData.id)
}
const manipulationForm = () => {
  taskUpdating()
}



</script>
