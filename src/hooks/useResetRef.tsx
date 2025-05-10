import { ref, Ref, UnwrapRef } from "vue";
import { cloneDeep } from "lodash";

export default function <T>(initValue: T): [Ref<UnwrapRef<T>>, () => void] {
  const resetValue = cloneDeep(initValue);
  const data = ref(initValue) as Ref<UnwrapRef<T>>;

  const reset = () => {
    data.value = cloneDeep(resetValue) as UnwrapRef<T>;
  };

  return [data, reset];
}
