<template>
  <client-required-adaptive-layout
    :title="$appt('menu.userTasks')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "UserTasks",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      user_: null,
      token_: null,
      client_: null,
    }
  },
  computed: {
    /**
     *
     * @returns {UserTasksApi}
     */
    userTasksApi() {
      return this.$options.ext.userTasksApi(this.token_.access_token)
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
