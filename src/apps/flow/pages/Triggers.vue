<template>
  <client-required-adaptive-layout
    :title="$appt('menu.triggers')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "Trigger",
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
     * @returns {TriggersApi}
     */
    triggersApi() {
      return this.$options.ext.triggersApi(this.token_.access_token)
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
