<template>
  <q-dialog v-model="prompt">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div v-if="updateDeleteType.bool" class="text-h6">Создать модуль</div>
        <div v-else class="text-h6">Изменить модуль</div>
      </q-card-section>

      <form @submit.prevent="moduleCreate" v-if="updateDeleteType.bool">
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
            <q-input readonly filled v-model="dateAndTimeCreateStart" label="Начало" :rules="[required]">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="dateCreate.dateCreateStart" mask="DD.MM.YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="dateCreate.timeCreateStart" mask="HH:mm:ss" format24h>
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
            <q-input readonly filled v-model="dateAndTimeCreateEnd" label="Конец" :rules="[required]">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="dateCreate.dateCreateEnd" mask="DD.MM.YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="dateCreate.timeCreateEnd" mask="HH:mm:ss" format24h>
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
          <q-btn flat label="Создать" v-close-popup type="submit" />
        </q-card-actions>
      </form>
      <form @submit.prevent="moduleUpdateElement(updateDeleteType.id)" v-else>
        <q-input
        filled
        v-model="moduleNameUpdate"
        label="Имя модуля"
        class="q-pa-md"
        :rules="[required]"
        />
        <q-select
          class="q-pa-md"
          filled
          v-model="modelUserModuleUpdate"
          :options="groupSubjectUsers"
          label="Ответственный"
          :rules="[requiredSelect]"
        />

        <div class="q-pt-md q-px-md" style="max-width: 500px">
            <q-input readonly filled v-model="dateAndTimeUpdateStart" label="Начало" :rules="[required]">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="dateUpdate.dateUpdateStart" mask="DD.MM.YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="dateUpdate.timeUpdateStart" mask="HH:mm:ss" format24h>
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
            <q-input readonly filled v-model="dateAndTimeUpdateEnd" label="Конец" :rules="[required]">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="dateUpdate.dateUpdateEnd" mask="DD.MM.YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="dateUpdate.timeUpdateEnd" mask="HH:mm:ss" format24h>
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
          <q-btn flat label="Изменить" v-close-popup type="submit" />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>

  <div class="q-ma-xl">
    <q-btn
      label="Создать"
      color="primary"
      @click="
        {
          prompt = true;
          updateDeleteType.bool = true;
        }
      "
    />
    <div v-if="loading">
      <p>Загрузка</p>
    </div>
    <div v-else class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="index">
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="primary"
                round
                dense
                @click="moduleDeleteElement(props.row.id)"
                icon="clear"
              />
              <q-btn
                size="sm"
                color="primary"
                round
                dense
                @click="
                  {
                    updateDeleteType.bool = false;
                    updateDeleteType.id = props.row.id;
                    prompt = true;
                    moduleUpdateElementForm(props.row.index);
                  }
                "
                icon="create"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { useMutation, useQuery } from "@vue/apollo-composable";
import { computed, ref } from "vue";
import {
  createModule,
  createPermissionRule,
  createPage,
  deleteModule,
  deletePage,
  updateModule,
  updatePage,
  updatePermissionRule
} from "src/graphql/mutations.js";
import {
  getModulesAll,
  getGroupSubjects,
  getPagesModule,
} from "src/graphql/queries.js";
import { useValidators, useValidatorsSelect } from "src/use/validators.js";

const dateCreate = ref({
  dateCreateEnd: '01.01.2021',
  dateCreateStart: '01.01.2021',
  timeCreateStart: '00:00:00',
  timeCreateEnd: '00:00:00',
})

const dateAndTimeCreateEnd = computed(() => `${dateCreate.value.dateCreateEnd} ${dateCreate.value.timeCreateEnd}`)
const dateAndTimeCreateStart = computed(() =>`${dateCreate.value.dateCreateStart} ${dateCreate.value.timeCreateStart}`)

const { required } = useValidators();
const { requiredSelect } = useValidatorsSelect();
const rows = ref();
const groupSubjectUsers = ref();
const updateDeleteType = ref({
  bool: true,
  id: "",
});
const { result, loading, onResult, refetch } = useQuery(getModulesAll);
const { result: groupSubject, onResult: onResultGetGroup } = useQuery(
  getGroupSubjects,
  {
    group_id: "3163550221139005516",
  }
);

onResult(() => {
  rows.value = result?.value?.paginate_type1?.data.map((el, i) => ({
    ...el,
    id: el.id,
    index: i,
  }));
});

onResultGetGroup(() => {
  groupSubjectUsers.value = groupSubject?.value?.get_group.subject.map((el) => {
    return {
      label: `${el.fullname.first_name} ${el.fullname.last_name}`,
      value: el.id,
    };
  });
});

const prompt = ref(false);
const moduleName = ref("");
const modelUserModule = ref("");
const moduleNameUpdate = ref("");
const modelUserModuleUpdate = ref("");

const columns = [
  {
    name: "name",
    required: true,
    label: "Название",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "first_name",
    label: "Ответственный",
    field: (row) =>
      `${row.property5.fullname.first_name} ${row.property5.fullname.last_name}`,
  },
  {
    name: "start",
    label: "Начало",
    field: (row) => `${row.property6.date} ${row.property6.time}`,
  },
  {
    name: "finish",
    label: "Конец",
    field: (row) => `${row.property7.date} ${row.property7.time}`,
  },
];

const moduleCreate = async () => {
  const { mutate: creatingModule } = useMutation(createModule);
  const { data: createdModule } = await creatingModule({
    input: {
      name: moduleName.value,
      property5: {
        "8044196206941661177": modelUserModule.value.value,
      },
      property6: {
        date: dateCreate.value.dateCreateStart,
        time: dateCreate.value.timeCreateStart,
      },
      property7: {
        date: dateCreate.value.dateCreateEnd,
        time: dateCreate.value.timeCreateEnd,
      },
    },
  });

  const { mutate: creatingPage } = useMutation(createPage);
  const { data: createdPage } = await creatingPage({
    input: {
      title: createdModule.create_type1.record.name,
      parent_id: "3642539153476219801",
      icon: "list_alt",
      object: {
        id: createdModule.create_type1.recordId,
        type_id: createdModule.create_type1.record.type_id,
      },
    },
  });

  const { mutate: creatingPermissionRule } = useMutation(createPermissionRule);
  const { data: createdPermissionRuleForPage } = await creatingPermissionRule({
    input: {
      model_type: "page",
      model_id: createdPage.pageCreate.recordId,
      owner_type: "subject",
      owner_id: modelUserModule.value.value,
      level: 5,
    },
  });

  const { data: createdPermissionRuleForModuleObject } =
    await creatingPermissionRule({
      input: {
        model_type: "object",
        model_id: createdModule.create_type1.recordId,
        owner_type: "subject",
        owner_id: modelUserModule.value.value,
        level: 5,
      },
    });

    refetch()

  return {
    createdModule,
    createdPage,
    createdPermissionRuleForPage,
    createdPermissionRuleForModuleObject,
  };
};

const { mutate: deletingModule } = useMutation(deleteModule);
const { mutate: deletingPage } = useMutation(deletePage);

const moduleDelete = async (moduleId, pageId) => {
  const { data: delM } = await deletingModule({
    module_id: moduleId,
  });

  const { data: delP } = await deletingPage({
    page_id: pageId,
  });

  console.log(delM, delP);
};

const delModule = ref();

const { result: pageData } = useQuery(getPagesModule, {
  id: "3642539153476219801",
});

const moduleDeleteElement = (id) => {
  delModule.value = pageData?.value?.page.children.data.find(
    (el) => el.object.id == id
  );

  moduleDelete(id, delModule.value.id);

  refetch();
};

const { mutate: updatingModule } = useMutation(updateModule);
const { mutate: updatingPage } = useMutation(updatePage);
const { mutate: updatingPermissionRule } = useMutation(updatePermissionRule)

const updatedModule = ref();

const moduleUpdate = async (moduleId, pageId) => {
  const { data: updateM } = await updatingModule({
    id: moduleId,
    input: {
      name: moduleNameUpdate.value,
      property5: {
        "8044196206941661177": modelUserModuleUpdate.value.value,
      },
      property6: {
        date: dateUpdate.value.dateUpdateStart,
        time: dateUpdate.value.timeUpdateStart,
      },
      property7: {
        date: dateUpdate.value.dateUpdateEnd,
        time: dateUpdate.value.timeUpdateEnd,
      },
    },
  });
  console.log(moduleNameUpdate.value);
  const { data: updateP } = await updatingPage({
    id: pageId,
    input: {
      title: moduleNameUpdate.value,
    },
  });

  console.log(updateM, updateP);

  refetch();
};

const dateUpdate = ref()

const dateAndTimeUpdateEnd = computed(() => `${dateUpdate.value.dateUpdateEnd} ${dateUpdate.value.timeUpdateEnd}`)
const dateAndTimeUpdateStart = computed(() =>`${dateUpdate.value.dateUpdateStart} ${dateUpdate.value.timeUpdateStart}`)

const moduleUpdateElementForm = (index) => {
  dateUpdate.value = {
  dateUpdateEnd: rows.value[index].property7.date,
  dateUpdateStart: rows.value[index].property6.date,
  timeUpdateStart: rows.value[index].property6.time,
  timeUpdateEnd: rows.value[index].property7.time,
  }

  moduleNameUpdate.value = rows.value[index].name;
  modelUserModuleUpdate.value = {
    label: `${rows.value[index].property5.fullname.first_name} ${rows.value[index].property5.fullname.last_name}`,
    value: rows.value[index].property5.id,
  };
};

const moduleUpdateElement = (id) => {
  updatedModule.value = pageData?.value?.page.children.data.find(
    (el) => el.object.id == id
  );
  console.log(id);

  moduleUpdate(id, updatedModule.value.id);
};
</script>
