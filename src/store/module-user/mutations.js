import { computed } from "vue";
export function SET_USER(state, result) {
  const user = computed(() => result.value?.user ?? []);
  state.user = user;
}
