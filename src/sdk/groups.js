import {
  provideApolloClient,
  useMutation,
  useQuery,
} from "@vue/apollo-composable";
import apolloClient from "src/apollo/apollo-client";
import { userGroupInviteUser } from "src/graphql/mutations";
import { getGroupSubjects } from "src/graphql/queries";

provideApolloClient(apolloClient);

const { refetch: refetchSubjects } = useQuery(getGroupSubjects, {
  group_id: "1",
});

const { mutate: inviteUser } = useMutation(userGroupInviteUser);

const groupCreate = () => {};

const userInvite = async (form, pageId, groupId) => {
  const { data } = await inviteUser({
    input: {
      name: form.first_name,
      surname: form.last_name,
      email: form.email,
      page_group_id: pageId,
    },
  });

  await refetchSubjects({
    group_id: groupId,
  });

  return data;
};

const groupApi = { groupCreate, userInvite };

export default groupApi;
