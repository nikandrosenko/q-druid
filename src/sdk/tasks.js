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
  const { mutate: creatingTask } = useMutation(createTask);
  const { data: createdTask } = await creatingTask({
    input: {
      name: task.name,
      property1: task.description,
      property2: {
        [process.env.SUBJECT_ID]: task.executor.value,
      },
      property3: process.env.APPOINTED_ID,
      property4: {
        [process.env.MODULE_ID]: moduleId,
      },
    },
  });
  const { mutate: creatingPermissionRule } = useMutation(createPermissionRule);
  const { data: createdPermissionRule } = await creatingPermissionRule({
    input: {
      model_type: "object",
      model_id: createdTask.create_type2.recordId,
      owner_type: "subject",
      owner_id: task.executor.value,
      level: 5,
    },
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
      property1: task.description,
      property2: {
        [process.env.SUBJECT_ID]: task.executor.value,
      },
      property3: task.status.value,
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
