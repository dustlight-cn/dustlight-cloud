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
  name: "UserTask",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      user_: null,
      token_: null,
      client_: null,
    }
  }
}
</script>

<style scoped>

</style>
