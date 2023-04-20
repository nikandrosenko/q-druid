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
  query pages($where: PaginatorWhere, $orderBy: PaginatorOrderBy) {
    rootPages(perPage: 50, page: 1, where: $where, orderBy: $orderBy) {
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
        tasks {
          id
          name
        }
        modules {
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
  query ($perPage: Int!, $page: Int!, $where: ObjectPaginatorWhere) {
    paginate_subject(perPage: $perPage, page: $page, where: $where) {
      data {
        id
        fullname {
          first_name
          last_name
          __typename
        }
        email {
          email
        }
        group {
          id
          name
        }
        modules {
          id
          name
        }
        tasks {
          id
          name
          module {
            id
            name
          }
        }
        user_id
        created_at
        updated_at
        __typename
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
        __typename
      }
      __typename
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
    paginate_module(page: 1, perPage: 100) {
      data {
        id
        type_id
        author_id
        level
        position
        created_at
        updated_at
        name
        responsible {
          id
          fullname {
            first_name
            last_name
          }
        }
        date_start {
          date
          time
        }
        date_end {
          date
          time
        }
        tasks {
          id
          name
          status
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

export const getUserModules = gql`
  query getUserModules(
    $where: ObjectPaginatorWhere
    $orderBy: ObjectPaginatorOrderBy
  ) {
    paginate_subject(perPage: 50, page: 1, where: $where, orderBy: $orderBy) {
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
        modules {
          id
          name
          created_at
          responsible {
            id
            fullname {
              first_name
              last_name
            }
          }

          date_start {
            date
            time
          }
          date_end {
            date
            time
          }
          tasks {
            id
            status
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
`;

export const getModuleById = gql`
  query getModuleById($module_id: String!) {
    get_module(id: $module_id) {
      id
      name
      responsible {
        id
        fullname {
          first_name
          last_name
        }
      }
      date_start {
        date
        time
      }
      date_end {
        date
        time
      }
      tasks {
        id
        name
        description
        executor {
          id
          fullname {
            first_name
            last_name
          }
        }
        status
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
          id
          object {
            id
          }
        }
      }
    }
  }
`;

export const getTasksAll = gql`
  query getTasks {
    paginate_task(page: 1, perPage: 100) {
      data {
        id
        type_id
        author_id
        level
        position
        created_at
        updated_at
        name
        description
        executor {
          id
          fullname {
            first_name
            last_name
          }
        }
        status
        modules {
          id
          name
          responsible {
            id
            fullname {
              first_name
              last_name
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
`;

export const getUserTasks = gql`
  query getUserTasks(
    $where: ObjectPaginatorWhere
    $orderBy: ObjectPaginatorOrderBy
  ) {
    paginate_subject(perPage: 50, page: 1, where: $where, orderBy: $orderBy) {
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
        tasks {
          id
          name
          description
          created_at
          executor {
            id
            user_id
            fullname {
              first_name
              last_name
            }
          }
          status
          module {
            id
            name
            responsible {
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
`;

export const permissionTreeSubjects = gql`
  query permissionTreeSubjects(
    $perPage: Int
    $page: Int
    $modelId: String!
    $groupId: String!
  ) {
    permissionTreeSubjects(
      perPage: $perPage
      page: $page
      modelId: $modelId
      groupId: $groupId
    ) {
      data {
        subject_id
        level
        permission_rule_id
      }
      paginatorInfo {
        perPage
        total
        count
        currentPage
        from
        to
        lastPage
        hasMorePages
      }
    }
  }
`;
