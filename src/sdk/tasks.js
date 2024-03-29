import {
  provideApolloClient,
  useMutation,
  useQuery,
} from "@vue/apollo-composable";
import {
  createTask,
  updateTask,
  deleteTask,
  createPermissionRule,
} from "src/graphql/mutations";
import { getModuleById } from "src/graphql/queries";
import apolloClient from "src/apollo/client";

provideApolloClient(apolloClient);

const { mutate: creatingTask } = useMutation(createTask);
const { mutate: updatingTask } = useMutation(updateTask);
const { mutate: deletingTask } = useMutation(deleteTask);
const { mutate: creatingPermissionRule } = useMutation(createPermissionRule);

const { refetch: refetchModule } = useQuery(getModuleById, {
  module_id: "1",
});

const taskCreate = async (task, moduleId) => {
  const { data: createdTask } = await creatingTask({
    input: {
      name: task.name,
      description: task.description,
      executor: {
        [process.env.SUBJECT_ID]: task.executor.value,
      },
      status: process.env.APPOINTED_ID,
      module: {
        [process.env.MODULE_ID]: moduleId,
      },
    },
  });
  const { data: createdPermissionRule } = await creatingPermissionRule({
    input: {
      model_type: "object",
      model_id: createdTask.create_task.recordId,
      owner_type: "subject",
      owner_id: task.executor.value,
      level: 5,
    },

    refetchModule,
  });

  return {
    createdTask,
    createdPermissionRule,
  };
};

const taskUpdate = async (task, taskId) => {
  const { data } = await updatingTask({
    id: taskId,
    input: {
      name: task.name,
      description: task.description,
      executor: {
        [process.env.SUBJECT_ID]: task.executor.value,
      },
      status: task.status.value,
    },
  });

  return data;
};

const taskDelete = async (taskId) => {
  const { data } = await deletingTask({
    task_id: taskId,
  });

  return data;
};

const taskApi = { taskCreate, taskUpdate, taskDelete };

export default taskApi;
