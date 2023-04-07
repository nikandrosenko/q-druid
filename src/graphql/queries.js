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
  query pages {
    rootPages {
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
        object {
          id
          type_id
        }
        children {
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
            object {
              id
              type_id
            }
          }
        }
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
        property5 {
          id
          name
        }
        property2 {
          id
          name
        }
      }
    }
  }
`;

export const getResponsibleGroupSubjects = gql`
  query getGroupSubjects {
    get_group(id: "4641879356844738186") {
      id
      author_id
      name
      description
      created_at
      updated_at
      subject {
        fullname {
          first_name
          last_name
        }
        group {
          id
          name
        }
        user_id
        id
      }
    }
  }
`;

export const getExecutorGroupSubjects = gql`
  query getGroupSubjects {
    get_group(id: "3550141303697212414") {
      id
      author_id
      name
      description
      created_at
      updated_at
      subject {
        fullname {
          first_name
          last_name
        }
        group {
          id
          name
        }
        user_id
        id
      }
    }
  }
`;

export const getSubject = gql`
  query getSubject($id: String!) {
    get_subject(id: $id) {
      email {
        email
      }
      group {
        name
        id
      }
      fullname {
        first_name
        middle_name
        last_name
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
      children {
        data {
          id
          title
          page_type
          object {
            id

            type_id
          }
        }
      }
      object {
        id
        type_id
      }
    }
  }
`;

export const getModulesAll = gql`
  query getModules {
    paginate_type1(page: 1, perPage: 100) {
      data {
        id
        type_id
        author_id
        level
        position
        created_at
        updated_at
        name
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
`;

export const getModuleById = gql`
  query getModuleById($module_id: String!) {
    get_type2(id: $module_id) {
      id
      name
      property4 {
        id
        fullname {
          first_name
          last_name
        }
      }
      property5 {
        date
        time
      }
      property6 {
        date
        time
      }
      property7 {
        id
        name
        property2 {
          id
          fullname {
            first_name
            last_name
          }
        }
      }
    }
  }
`;

export const getPagesModule = gql`
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
    children {
      data {
        object {
        id
        }
      }
    }
  }
}`
