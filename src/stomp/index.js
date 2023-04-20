import {
  provideApolloClient,
  useMutation,
  useQuery,
} from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";
import stompClient from "src/stomp/client";
import { notificationSubscribe } from "src/graphql/mutations";
import { pages, getUserModules, getUserTasks } from "src/graphql/queries";

provideApolloClient(apolloClient);

const currentUserId = localStorage.getItem("userId");

const { mutate: creatingQuery } = useMutation(notificationSubscribe);

const { refetch: refetchPages } = useQuery(pages);
const { refetch: refetchModules } = useQuery(getUserModules, {
  where: {
    column: "user_id",
    operator: "EQ",
    value: localStorage.getItem("userId"),
  },
});
const { refetch: refetchTasks } = useQuery(getUserTasks, {
  where: {
    column: "user_id",
    operator: "EQ",
    value: localStorage.getItem("userId"),
  },
});

const queueCreate = async () => {
  const { data: notificationSubscribed } = await creatingQuery();

  localStorage.setItem(
    "queue",
    notificationSubscribed.notificationSubscribe.hash
  );

  return notificationSubscribed;
};

const stompConnect = () => {
  const queue = localStorage.getItem("queue");

  const onConnect = async () => {
    let onMessage = (message) => {
      const messageObj = JSON.parse(message.body);

      console.log("Receive message:", messageObj);

      refetchPages();
      refetchTasks();
      refetchModules();

      message.ack();
    };

    stompClient.subscribe(`/amq/queue/${queue}`, onMessage, { ack: "client" });
  };

  const onError = (msg) => {
    console.log("Error", msg);
  };

  const onClose = (msg) => {
    console.log("Close", msg);
  };

  stompClient.connect(
    "readonly",
    "@3P^Lgdab)sv",
    onConnect,
    onError,
    "/",
    onClose
  );
};

const stompApi = { queueCreate, stompConnect };

export default stompApi;
