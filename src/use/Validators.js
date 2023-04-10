
export function useValidators() {
  return {
    required: (val) =>
      (val && val.length > 0) || "Обязательно для заполнения!",
  };
}

export function useValidatorsSelect() {
  return {
    required: (val) =>
      (val.value && val.value.length > 0) || "Обязательно для заполнения!",
  };
}
