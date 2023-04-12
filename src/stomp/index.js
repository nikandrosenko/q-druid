import {
  provideApolloClient,
  useMutation,
  useQuery,
} from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";
import stompClient from "src/stomp/client";
import { notificationSubscribe } from "src/graphql/mutations";
import {
  getUserModules,
  getUserTasks,
  pages,
  getPage,
  getModulesAll,
  getTasksAll,
} from "src/graphql/queries";
// import Cookies from "js-cookie";

provideApolloClient(apolloClient);

const { mutate: creatingQuery } = useMutation(notificationSubscribe);

const { refetch: refetchPages } = useQuery(pages);
// const { refetch: refetchPage } = useQuery(getPage, {
//   id: sessionStorage.getItem("route"),
// });
const { refetch: refetchModules } = useQuery(getModulesAll);
const { refetch: refetchTasks } = useQuery(getTasksAll);
// const { refetch: refetchModules } = useQuery(getUserModules);
// const { refetch: refetchTasks } = useQuery(getUserTasks);

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
    // console.log("connected");

    let onMessage = (message) => {
      const messageObj = JSON.parse(message.body);

      console.log("Receive message:", messageObj);

      // if (
      //   messageObj.type === "object.created" ||
      //   messageObj.type === "page.created" ||
      //   messageObj.type === "object.updated" ||
      //   messageObj.type === "page.updated" ||
      //   messageObj.type === "object.deleted" ||
      //   messageObj.type === "page.deleted"
      // ) {

      // console.log("owiwefjoiwejfoiwefgliwefgiwel");
      refetchPages();
      // refetchPage();
      refetchTasks();
      refetchModules();
      // }

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
