<template>
  <q-page class="q-ma-xl">

    <q-dialog v-model="prompt">
        <FormTasks :updateData="updateData"/>
      </q-dialog>

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

        <template v-slot:body="props" >
          <q-tr :props="props" :class="props.row.status.label==='Выполнено' ? 'bg-yellow' : props.row.status.label==='Назначено' ? 'bg-pink' : 'bg-green'">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="primary"
                round
                dense
                @click="
                  {
                    tasksUpdateElementForm(props.row.index, props.row.id);
                    prompt = true;
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
  </q-page>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import FormTasks from "./FormTasks.vue";

const prompt = ref(false)

const updateData = ref()

const { page } = defineProps({
  page: Object,
});
const isNewUser = ref(false);
const rows = ref();
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
    name: "description",
    label: "Описание",
    field: (row) => `${row.property1}`,
  },
  {
    name: "status",
    label: "Статус",
    field: (row) => `${row.status.label}`,
  },
];
let st = ref();
const currentUserId = localStorage.getItem("userId");
const { result, loading, onResult, refetch } = useQuery(gql`
  query getUserTasks {
    paginate_subject(
      page: 1
      perPage: 100
      where: { column: "user_id", operator: EQ, value: ${currentUserId} }
    ) {
      data {
        id
        type_id
        author_id
        level
        position
        created_at
        updated_at
        user_id
        fullname {
          first_name
          last_name
        }
        property2 {
          id
          name
          property1
          created_at
          property2 {
            id
            user_id
            fullname {
              first_name
              last_name
            }
          }
          property3
          property4 {
            id
            name
            property5 {
              id
              user_id
              fullname {
                first_name
                last_name
              }
            }
          }
        }
      }
      paginatorInfo {
        perPage
        currentPage
        lastPage
        total
        count
        from
        to
        hasMorePages
      }
    }
  }
`);
onResult(() => {
  rows.value = result?.value?.paginate_subject?.data[0]?.property2?.map(
    (el, i) => {
      let status = {};
      if (el.property3 === process.env.APPOINTED_ID) {
        status = {
          label: "Назначено",
          value: process.env.APPOINTED_ID,
        };
      } else if (el.property3 === process.env.COMPLETED_ID) {
        status = {
          label: "Выполнено",
          value: process.env.COMPLETED_ID,
        };
      } else {
        status = {
          label: "Завершено",
          value: process.env.FINISHED_ID,
        };
      }
      return {
        ...el,
        id: el.id,
        index: i,
        status: status,
      };
    }
  );
});

const tasksUpdateElementForm = (index, id) => {

  updateData.value = {
      id: id,
      moduleNameUpdate: rows.value[index].name,
      moduleDescriptionUpdate: rows.value[index].property1,
      modelUserModuleUpdate: {
        label: `${rows.value[index].property2.fullname.first_name} ${rows.value[index].property2.fullname.last_name}`,
        value: rows.value[index].property2.id,
      },
        moduleStatusUpdate: rows.value[index].status,
    }
}

onMounted(() => {
  if (!rows.value) refetch();
});
</script>
