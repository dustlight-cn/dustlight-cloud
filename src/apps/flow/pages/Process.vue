<template>
  <client-required-adaptive-layout
    :title="$appt('menu.processes') + '/' + $route.params.id"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "src/components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "Process",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      user_: null,
      token_: null,
      client_: null,
      processes: [],
      loading: false,
      pageSize: 10,
      page: 1
    }
  },
}
</script>

<style scoped>

</style>
