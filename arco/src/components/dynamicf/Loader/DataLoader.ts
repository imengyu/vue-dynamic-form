import { ref } from "vue"

export function useDataLoader<T>(loader: () => Promise<T>, options: { immediate?: boolean }) {
  const data = ref<T>()
  const loading = ref(false)
  const error = ref<Error>()

  function load() {
    loading.value = true
    loader().then((res) => {
      data.value = res
      loading.value = false
    }).catch((err) => {
      error.value = err
      loading.value = false
    })
  }

  if (options.immediate) {
    load()
  }

  return {
    data,
    loading,
    error,
    load,
  }
}