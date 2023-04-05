import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
export function GET_USER({ commit }) {
  const { result } = useQuery(
    gql`
      query User($id: String!) {
        user(id: $id) {
          id
          current_space_id
          email
          name
          surname
          registration_passed
          socials
          spaces
          avatar
          telegram_chat_id
          updated_at
          created_at
          deleted_at
        }
      }
    `,
    {
      id: localStorage.userId,
    }
  );
  commit("SET_USER", result);
  return result;
}
