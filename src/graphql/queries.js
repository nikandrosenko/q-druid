import gql from "graphql-tag";

export const User = gql`
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
`;
export const pages = gql`
  query {
    pages(perPage: 10, page: 1) {
      data {
        id
        parent_id
        page_type
        title
        content
        icon
        level
        is_public
        is_block
        position
        config
        created_at
        updated_at
      }
      paginatorInfo {
        perPage
        count
        total
        currentPage
        from
        to
        lastPage
        hasMorePages
      }
    }
  }
`;
export const getPage = gql`
  query getPage($id: String!) {
    page(id: $id) {
      id
      parent_id
      page_type
      title
      content
      icon
      level
      is_public
      position
      config
      is_block
      created_at
      updated_at
      object {
        id
        type_id
      }
    }
  }
`;
// export const getPage = gql`
//   query {
//     page(id: "5901342623205784345") {
//       id
//       parent_id
//       page_type
//       title
//       content
//       icon
//       level
//       is_public
//       position
//       config
//       is_block
//       created_at
//       updated_at
//     }
//   }
// `;
export const getModuleById = gql``;
export const getSubject = gql``;
export const getGroupSubjects = gql`
  query getGroupSubjects($group_id: String!) {
    get_group(id: $group_id) {
      id
      author_id
      name
      description
      created_at
      updated_at
      type_id
      subject {
        id
        user_id
        fullname {
          first_name
          last_name
        }
        email {
          email
        }
        group {
          id
          name
        }
      }
    }
  }
`;
export const getResponsibleGroupSubjects = gql``;
export const getExecutorGroupSubjects = gql``;
