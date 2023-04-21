<template>
  <q-card style="min-width: 350px">
    <q-card-section>
      <div v-if="props.updateDeleteType.bool" class="text-h6">
        Создать модуль
      </div>
      <div v-else class="text-h6">Изменить модуль</div>
    </q-card-section>

    <form @submit.prevent="manipulationForm">
      <q-input
        filled
        v-model="moduleName"
        label="Имя модуля"
        class="q-pa-md"
        :rules="[required]"
      />
      <q-select
        class="q-pa-md"
        filled
        v-model="modelUserModule"
        :options="groupSubjectUsers"
        label="Ответственный"
        :rules="[requiredSelect]"
      />

      <div class="q-pt-md q-px-md" style="max-width: 500px">
        <q-input
          readonly
          filled
          v-model="dateAndTimeStart"
          label="Начало"
          :rules="[required]"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="date.dateStart" mask="DD.MM.YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="date.timeStart" mask="HH:mm:ss" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="q-pt-md q-px-md" style="max-width: 500px">
        <q-input
          readonly
          filled
          v-model="dateAndTimeEnd"
          label="Конец"
          :rules="[required]"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="date.dateEnd" mask="DD.MM.YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="date.timeEnd" mask="HH:mm:ss" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Отмена" v-close-popup />
        <q-btn
          flat
          label="Создать"
          v-close-popup
          type="submit"
          v-if="props.updateDeleteType.bool"
        />
        <q-btn flat label="Изменить" v-close-popup type="submit" v-else />
      </q-card-actions>
    </form>
  </q-card>
</template>

<script setup>
import { useValidators, useValidatorsSelect } from "src/use/validators.js";
import { ref, computed, onMounted } from "vue";
import { getGroupSubjects } from "src/graphql/queries";
import { useQuery } from "@vue/apollo-composable";

const props = defineProps({
  dataUpdate: Object,
  updateDeleteType: Object,
});

const date = ref({
  dateEnd: props.dataUpdate.dateUpdate.dateUpdateEnd,
  dateStart: props.dataUpdate.dateUpdate.dateUpdateStart,
  timeStart: props.dataUpdate.dateUpdate.timeUpdateStart,
  timeEnd: props.dataUpdate.dateUpdate.timeUpdateEnd,
});

const updatePermissionOrNot = ref(false);

const dateAndTimeEnd = computed(
  () => `${date.value.dateEnd} ${date.value.timeEnd}`
);
const dateAndTimeStart = computed(
  () => `${date.value.dateStart} ${date.value.timeStart}`
);

const { required } = useValidators();
const { requiredSelect } = useValidatorsSelect();

const moduleName = ref(props.dataUpdate.moduleNameUpdate);
const modelUserModule = ref(props.dataUpdate.modelUserModuleUpdate);
const groupSubjectUsers = ref();

const {
  result: groupSubject,
  onResult: onResult,
  refetch: refetchSubject,
} = useQuery(getGroupSubjects, {
  group_id: "3163550221139005516",
});

onResult(() => {
  groupSubjectUsers.value = groupSubject?.value?.get_group.subject.map((el) => {
    return {
      label: `${el.fullname.first_name} ${el.fullname.last_name}`,
      value: el.id,
    };
  });
});

const emits = defineEmits(["create", "update"]);

const manipulationForm = () => {
  if (props.dataUpdate.modelUserModuleUpdate !== modelUserModule.value) {
    updatePermissionOrNot.value = true;
  } else {
    updatePermissionOrNot.value = false;
  }

  if (props.updateDeleteType.bool) {
    emits("create", {
      emitValue: {
        date,
        moduleName,
        modelUserModule,
      },
    });
  } else {
    emits("update", {
      emitValue: {
        date,
        moduleName,
        modelUserModule,
        id: props.updateDeleteType.id,
        updatePermission: updatePermissionOrNot.value,
      },
    });
  }
};
onMounted(() => {
  if (!groupSubjectUsers.value) refetchSubject();
});
</script>
