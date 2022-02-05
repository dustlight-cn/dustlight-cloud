<template>
  <client-required-adaptive-layout
    :title="$appt('menu.triggers')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <q-input :loading="loading" debounce="500" filled v-model="key"/>
    <q-select :loading="loading" v-model="opt" :options="options" @filter="loadOperation"/>

    {{ processes }}
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
      loading: false,
      key: this.$route.query.key || "",
      opt: this.$route.query.opt || "",
      processes: [],
      options: null
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
  watch: {
    token_() {
      this.loadTriggers()
    },
    client_() {
      this.loadTriggers()
    },
    "$route.query.key"() {
      this.key = this.$route.query.key
    },
    "$route.query.opt"() {
      this.opt = this.$route.query.opt
    },
    key() {
      this.loadTriggers()
    },
    opt() {
      this.loadTriggers()
    }
  },
  methods: {
    loadTriggers() {
      if (this.loading || !this.opt)
        return
      this.loading = true
      this.triggersApi.getTriggerProcess(this.key, this.opt, this.client_.cid)
        .then(res => this.processes = res.data)
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    loadOperation(val, update, abort) {
      if (this.options != null) {
        update()
        return
      }
      this.triggersApi.getOperations()
        .then(res => this.options = res.data)
        .catch(this.$throw)
        .finally(() => update())
    }
  }
}
</script>

<style scoped>

</style>
