<template>
  <client-required-adaptive-layout
    :title="$appt('menu.channels')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}
    <channel-list push-route-with-page :to="getChannelRoute" :client="client" :token="token"/>

    <q-page-sticky :offset="[18,18]">
      <q-btn :loading="creating" @click="newTemplate" color="primary" round icon="add"/>
    </q-page-sticky>
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
      token_: null,
      creating: false
    }
  },
  computed: {
    /**
     *
     * @returns {ChannelsApi}
     */
    channelsApi() {
      return this.$options.ext.channelsApi(this.token_.access_token)
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
    },
    newTemplate() {
      if (this.creating)
        return
      this.$q.dialog({
        cancel: true,
        title: this.$appt('newChannel'),
        prompt: {
          label: this.$appt('channelName'),
          isValid: val => val && val.trim().length > 0
        }
      }).onOk(val => {
        if (this.creating)
          return
        this.creating = true
        this.channelsApi.createChannel({
          name: val,
          description: ""
        }, this.client_.cid)
          .then(res => {
            this.$router.push({
              name: this.$options.app + "/channel",
              params: {
                id: res.data.id
              }
            })
          })
          .catch(this.$throw)
          .finally(() => this.creating = false)
      })
    },
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
