import { provideApolloClient, useMutation, useQuery } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";
import {
  createModule,
  createPermissionRule,
  createPage,
  deleteModule,
  deletePage,
  updateModule,
  updatePage,
  permissionRuleDeleting
} from "src/graphql/mutations.js";
import { permissionTreeSubjects } from "src/graphql/queries.js";

provideApolloClient(apolloClient);

const { mutate: updatingModule } = useMutation(updateModule);
const { mutate: updatingPage } = useMutation(updatePage);
const { mutate: deletingModule } = useMutation(deleteModule);
const { mutate: deletingPage } = useMutation(deletePage);
const { mutate: creatingModule } = useMutation(createModule);
const { mutate: permissionRuleDelete } = useMutation(permissionRuleDeleting)
const { mutate: creatingPermissionRule } = useMutation(createPermissionRule);

const { result: dataPermission } = useQuery(permissionTreeSubjects)

const moduleCreate = async (emitValue) => {
  const { data: createdModule } = await creatingModule({
    input: {
      name: emitValue.emitValue.moduleName.value,
      property5: {
        [process.env.SUBJECT_ID]:
          emitValue.emitValue.modelUserModule.value.value,
      },
      property6: {
        date: emitValue.emitValue.date.value.dateStart,
        time: emitValue.emitValue.date.value.timeStart,
      },
      property7: {
        date: emitValue.emitValue.date.value.dateEnd,
        time: emitValue.emitValue.date.value.timeEnd,
      },
    },
  });

  const { mutate: creatingPage } = useMutation(createPage);
  const { data: createdPage } = await creatingPage({
    input: {
      title: createdModule.create_type1.record.name,
      parent_id: process.env.MODULES_PAGE_ID,
      icon: "list_alt",
      object: {
        id: createdModule.create_type1.recordId,
        type_id: createdModule.create_type1.record.type_id,
      },
    },
  });

  const { data: createdPermissionRuleForPage } = await creatingPermissionRule({
    input: {
      model_type: "page",
      model_id: createdPage.pageCreate.recordId,
      owner_type: "subject",
      owner_id: emitValue.emitValue.modelUserModule.value.value,
      level: 5,
    },
  });

  const { data: createdPermissionRuleForModuleObject } =
    await creatingPermissionRule({
      input: {
        model_type: "object",
        model_id: createdModule.create_type1.recordId,
        owner_type: "subject",
        owner_id: emitValue.emitValue.modelUserModule.value.value,
        level: 5,
      },
    });
};

const moduleDelete = async (moduleId, pageId) => {
  const { data: delM } = await deletingModule({
    module_id: moduleId,
  });

  const { data: delP } = await deletingPage({
    page_id: pageId,
  });
};

const permissionIdForDeleted = ref({
  module: '',
  page: ''
})

const moduleUpdate = async (moduleId, pageId, emitValue) => {
  const { data: updateM } = await updatingModule({
    id: moduleId,
    input: {
      name: emitValue.emitValue.moduleName.value,
      property5: {
        [process.env.SUBJECT_ID]:
          emitValue.emitValue.modelUserModule.value.value,
      },
      property6: {
        date: emitValue.emitValue.date.value.dateStart,
        time: emitValue.emitValue.date.value.timeStart,
      },
      property7: {
        date: emitValue.emitValue.date.value.dateEnd,
        time: emitValue.emitValue.date.value.timeEnd,
      },
    },
  });

  const { data: updateP } = await updatingPage({
    id: pageId,
    input: {
      title: emitValue.emitValue.moduleName.value,
    },
  });

  if(emitValue.emitValue.updatePermission.value){

    permissionIdForDeleted.value.module = permissionTreeSubjects?.value?.data.find((el) => {
      el.subject_id === moduleId
    })

    permissionIdForDeleted.value.page = permissionTreeSubjects?.value?.data.find((el) => {
      el.subject_id === pageId
    })

    const { data: deletePermissionModule } = await permissionRuleDelete({
      id: permissionIdForDeleted.value.module
    })

    const { data: deletePermissionPage } = await permissionRuleDelete({
      id: permissionIdForDeleted.value.page
    })

    const { data: createdPermissionRuleForPage } = await creatingPermissionRule({
      input: {
        model_type: "page",
        model_id: moduleId,
        owner_type: "subject",
        owner_id: emitValue.emitValue.modelUserModule.value.value,
        level: 5,
      },
    });

    const { data: createdPermissionRuleForModuleObject } =
      await creatingPermissionRule({
        input: {
          model_type: "object",
          model_id: pageId,
          owner_type: "subject",
          owner_id: emitValue.emitValue.modelUserModule.value.value,
          level: 5,
        },
      });

  }
};

const moduleApi = { moduleCreate, moduleDelete, moduleUpdate };

export default moduleApi;
