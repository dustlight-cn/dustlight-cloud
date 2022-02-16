<template>
  <client-required-adaptive-layout
    :title="$appt('menu.configs')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

  </client-required-adaptive-layout>
</template>

<script>
import ChannelList from "../../messenger/components/ChannelList";
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "Configs",
  components: {ChannelList, ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,
      creating: false
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
