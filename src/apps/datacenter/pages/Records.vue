<template>
  <client-required-adaptive-layout
    :title="$appt('menu.records')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "Records",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>