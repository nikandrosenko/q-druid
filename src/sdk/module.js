import { provideApolloClient, useMutation } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";
import {
  createModule,
  createPermissionRule,
  createPage,
  deleteModule,
  deletePage,
  updateModule,
  updatePage,
  updatePermissionRule,
} from "src/graphql/mutations.js";

provideApolloClient(apolloClient);

const { mutate: updatingModule } = useMutation(updateModule);
const { mutate: updatingPage } = useMutation(updatePage);
const { mutate: updatingPermissionRule } = useMutation(updatePermissionRule);
const { mutate: deletingModule } = useMutation(deleteModule);
const { mutate: deletingPage } = useMutation(deletePage);
const { mutate: creatingModule } = useMutation(createModule);

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

  const { mutate: creatingPermissionRule } = useMutation(createPermissionRule);
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

const moduleDelete = async (moduleId, pageId, emitValue) => {
  const { data: delM } = await deletingModule({
    module_id: moduleId,
  });

  const { data: delP } = await deletingPage({
    page_id: pageId,
  });
};

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
};

const moduleApi = { moduleCreate, moduleDelete, moduleUpdate };

export default moduleApi;
