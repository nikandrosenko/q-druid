<template>
  <div>
    <q-dialog v-model="prompt">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Создать модуль</div>
        </q-card-section>

        <form @submit.prevent="moduleCreate">
          <q-input v-model="moduleName" label="Имя модуля" />
          <q-select
            v-model="modelUserModule"
            :options="groupSubjectUsers"
            label="Ответственный"
          />

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Отмена" v-close-popup />
            <q-btn flat label="Создать" v-close-popup type="submit" />
          </q-card-actions>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup></script>
