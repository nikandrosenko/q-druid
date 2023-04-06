<template>
   <q-dialog v-model="prompt">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Создать модуль</div>
        </q-card-section>

        <form @submit.prevent="creatingModule">
          <q-input v-model="moduleName" label="Имя модуля" />


        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Создать" v-close-popup type="submit"/>
        </q-card-actions>
      </form>
      </q-card>
    </q-dialog>

    <q-btn label="Создать" color="primary" @click="prompt = true" />

  <div v-if="loading">
    <p>Загрузка</p>
  </div>
  <div v-else class="q-pa-md">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>


</template>

<script setup>
import { useMutation, useQuery } from '@vue/apollo-composable';
import { ref } from 'vue';
import { createModule } from 'src/graphql/mutations.js'
import { getModulesAll } from 'src/graphql/queries.js'

  const prompt = ref(false)
  const moduleName = ref('')

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Название',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'first_name', label: 'Ответсвенный', field: row => `${row.property5.fullname.first_name} ${row.property5.fullname.last_name}` },
  { name: 'start', label: 'Начало', field: row => `${row.property6.date} ${row.property6.time}` },
  { name: 'finish', label: 'Конец', field: row => `${row.property7.date} ${row.property7.time}` },
]

  const { result, loading } = useQuery(getModulesAll)

  const rows = ref(result?.value?.paginate_type1?.data)

  const creatingModule = () => {

    const { mutate: createdModule } = useMutation(createModule,
    {
    input:{
        name: moduleName,
          property5: {
            "8044196206941661177": "8212866342665324878"
          },
          property6: {
            date: "01.01.2023",
            time: "01:00:00"
          },
          property7: {
            date: "01.01.2023",
            time: "23:59:00"
          }
    }
    }
  );

  createdModule().then(res => {
      if (!res.errors) {
        console.log(res.data)
      } else {
        console.log(2);
      }
    })
    .catch((e) => {
      if (e.graphQLErrors) {
        console.log(e.graphQLErrors);
      }
   })

  }



</script>
