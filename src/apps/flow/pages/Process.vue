<template>
  <client-required-adaptive-layout
    :title="$appt('menu.processes')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <!--    {{ process }}-->
    <div class="q-pb-md text-subtitle1">
      <q-icon name="fas fa-code-branch"/>
      {{ $route.params.name }}
      <q-badge>
        <q-skeleton v-if="loading || !prcs" type="text" width="1em"/>
        <span v-else>v{{ prcs.version }}</span>
      </q-badge>
    </div>
    <div v-if="loading" class="text-center">
      <q-spinner-gears color="primary" size="5em"/>
    </div>
    <bpm v-else-if="prcs" :xml="prcs.data" :is-base64="true"/>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "src/components/container/ClientRequiredAdaptiveLayout";
import Bpm from "../components/Bpm";

export default {
  name: "Process",
  components: {Bpm, ClientRequiredAdaptiveLayout},
  data() {
    return {
      user_: null,
      token_: null,
      client_: null,
      prcs: null,
      loading: false,
      version: this.$route.query.version
    }
  },
  computed: {
    /**
     *
     * @returns {ProcessesApi}
     */
    processesApi() {
      return this.$options.ext.processApi(this.token_.access_token)
    }
  },
  watch: {
    token_() {
      this.loadProcess()
    },
    client_() {
      this.loadProcess()
    },
  },
  methods: {
    loadProcess() {
      if (this.loading)
        return
      this.loading = true
      let p = this.version ?
        this.processesApi.getProcess1(this.$route.params.name, this.version, this.client_.cid) :
        this.processesApi.getProcess(this.$route.params.name, this.client_.cid)
      p.then(res => this.prcs = res.data)
        .catch(this.$throw)
        .finally(() => this.loading = false)
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
