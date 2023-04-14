import {
  provideApolloClient,
  useMutation,
  useQuery,
} from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";
import stompClient from "src/stomp/client";
import { notificationSubscribe } from "src/graphql/mutations";
import { pages, getModulesAll, getTasksAll } from "src/graphql/queries";
import gql from "graphql-tag";

provideApolloClient(apolloClient);

const currentUserId = localStorage.getItem("userId");

const { mutate: creatingQuery } = useMutation(notificationSubscribe);

const { refetch: refetchPages } = useQuery(pages);
// const { refetch: refetchModules } = useQuery(getModulesAll);
const { refetch: refetchModules } = useQuery(gql`
  query getUserModules {
    paginate_subject(page: 1, perPage: 100, where: { column: "user_id", operator: EQ, value: ${currentUserId} }) {
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
        property5 {
          id
          name
          created_at
          property5 {
            id
            fullname {
              first_name
              last_name
            }
          }

          property6 {
            date
            time
          }
          property7 {
            date
            time
          }
          property4 {
            id
            property3
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
// const { refetch: refetchTasks } = useQuery(getTasksAll);
const { refetch: refetchTasks } = useQuery(gql`
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
