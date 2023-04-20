import gql from "graphql-tag";

export const userGroupInviteUser = gql`
  mutation userGroupInviteUser($input: UserGroupInviteUserInput!) {
    userGroupInviteUser(input: $input) {
      status
    }
  }
`;
export const userSignIn = gql`
  mutation UserSignIn($input: UserSignInInput!) {
    userSignIn(input: $input) {
      recordId
      record {
        token_type
        expires_in
        access_token
        refresh_token
      }
      status
    }
  }
`;
export const userSignUp = gql`
  mutation UserSignUp($input: UserSignUpInput!) {
    userSignUp(input: $input) {
      recordId
      record {
        id
        email
        registration_passed
        name
        surname
      }
      status
    }
  }
`;
export const userSignUpSetPassword = gql`
  mutation UserSignUpSetPassword($input: UserSignUpSetPasswordInput!) {
    userSignUpSetPassword(input: $input) {
      status
    }
  }
`;
export const userSignInSocialNetwork = gql`
  mutation UserSignInSocialNetwork($input: UserSignInSocialNetworkInput!) {
    userSignInSocialNetwork(input: $input) {
      recordId
      record {
        token_type
        expires_in
        access_token
      }
      status
    }
  }
`;
export const userResetPasswordSendCode = gql`
  mutation UserResetPasswordSendCode($input: UserResetPasswordSendCodeInput!) {
    userResetPasswordSendCode(input: $input) {
      record {
        user_id
      }
      status
    }
  }
`;
export const userResetPasswordConfirmCodeSetPassword = gql`
  mutation UserResetPasswordConfirmCodeSetPassword(
    $input: UserResetPasswordConfirmCodeSetPasswordInput!
  ) {
    userResetPasswordConfirmCodeSetPassword(input: $input) {
      record {
        email
      }
      status
    }
  }
`;
export const userUpdate = gql`
  mutation UserUpdate($id: String!, $input: UserUpdateInput!) {
    userUpdate(id: $id, input: $input) {
      recordId
      record {
        id
        current_space_id
        email
        name
        surname
        registration_passed
        socials
        spaces
        avatar
        last_space_id
        telegram_chat_id
        updated_at
        created_at
        deleted_at
      }
      status
    }
  }
`;
export const createModule = gql`
  mutation ($input: create_module_input!) {
    create_module(input: $input) {
      status
      recordId
      record {
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
          user_id
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
          name
          description
          executor {
            fullname {
              first_name
              last_name
            }
          }
        }
      }
    }
  }
`;
export const createTask = gql`
  mutation ($input: create_task_input!) {
    create_task(input: $input) {
      status
      recordId
      record {
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
          user_id
          fullname {
            first_name
            last_name
          }
        }
        module {
          id
        }
      }
    }
  }
`;

export const updateTask = gql`
  mutation ($id: String!, $input: update_task_input!) {
    update_task(id: $id, input: $input) {
      status
      recordId
      record {
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
          user_id
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
export const createPage = gql`
  mutation ($input: PageCreateInput!) {
    pageCreate(input: $input) {
      recordId
      status
      record {
        parent_id
        page_type
        title
        content
        icon
        level
        is_public
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
`;

export const createPermissionRule = gql`
  mutation permissionRuleCreate($input: PermissionRuleCreateInput!) {
    permissionRuleCreate(input: $input) {
      recordId
      status
      record {
        id
        author_id
        level
        model_type
        model_id
        config
        owner_id
        owner_type
        created_at
        updated_at
      }
    }
  }
`;

export const updatePermissionRule = gql`
  mutation permissionRuleUpdate(
    $id: String!
    $input: PermissionRuleUpdateInput!
  ) {
    permissionRuleUpdate(id: $id, input: $input) {
      recordId
      status
      record {
        id
        author_id
        level
        model_type
        model_id
        config
        owner_id
        owner_type
        created_at
        updated_at
      }
    }
  }
`;

export const updateModule = gql`
  mutation ($input: update_module_input!, $id: String!) {
    update_module(id: $id, input: $input) {
      status
      recordId
      record {
        id
        type_id
        author_id
        level
        position
        created_at
        updated_at
        name
      }
    }
  }
`;

export const updatePage = gql`
  mutation updatePage($id: String!, $input: PageUpdateInput!) {
    pageUpdate(id: $id, input: $input) {
      recordId
      record {
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
      status
    }
  }
`;

export const deleteModule = gql`
  mutation deleteModule($module_id: String!) {
    delete_module(id: $module_id) {
      recordId
    }
  }
`;
export const deleteTask = gql`
  mutation deleteTask($task_id: String!) {
    delete_task(id: $task_id) {
      recordId
    }
  }
`;
export const deletePage = gql`
  mutation deletePage($page_id: String!) {
    pageDelete(id: $page_id) {
      recordId
    }
  }
`;

export const notificationSubscribe = gql`
  mutation {
    notificationSubscribe {
      hash
    }
  }
`;

export const permissionRuleDeleting = gql`
  mutation permissionRuleDelete($id: String!) {
    permissionRuleDelete(id: $id) {
      recordId
      status
    }
  }
`;
