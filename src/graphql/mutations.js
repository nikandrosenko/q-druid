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
  mutation ($input: create_type1_input!) {
    create_type1(input: $input) {
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
        property5 {
          id
          user_id
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
          name
          property1
          property2 {
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
export const updateModule = gql`
  mutation ($input: update_type1_input!, $id: String!) {
    update_type1(id: $id, input: $input) {
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
