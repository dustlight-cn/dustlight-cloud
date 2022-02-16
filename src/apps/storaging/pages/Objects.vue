<template>
  <client-required-adaptive-layout
    :title="$appt('menu.objects')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <q-page-sticky :offset="[18,18]">
      <q-btn :loading="creating" @click="newObject" color="primary" round icon="add"/>
    </q-page-sticky>
  </client-required-adaptive-layout>
</template>

<script>
import ChannelList from "../../messenger/components/ChannelList";
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "Objects",
  components: {ChannelList, ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,
      creating: false
    }
  },
  methods:{
    newObject(){

    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
