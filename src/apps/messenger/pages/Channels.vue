<template>
  <client-required-adaptive-layout
    :title="$appt('menu.channels')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}
    <channel-list push-route-with-page :to="getChannelRoute" :client="client" :token="token"/>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
import ChannelList from "../components/ChannelList";

export default {
  name: "Channels",
  components: {ChannelList, ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null
    }
  },
  methods: {
    getChannelRoute(channel) {
      return {
        name: this.$options.app + "/channel",
        params: {
          id: channel.id
        }
      }
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
