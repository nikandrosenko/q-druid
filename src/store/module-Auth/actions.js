export function AUTH_USER_DATA_RESPONSE_TOKEN ({ commit }, token) {
  console.log(token)
  commit('AUTH_USER_DATA_TOKEN', token)
}

