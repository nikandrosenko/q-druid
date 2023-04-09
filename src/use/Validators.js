
export function useValidators() {
  return {
    required: (val) =>
      (val && val.length > 0) || "Обязательно для заполнения!",
  };
}
