<template>
  <client-required-adaptive-layout
    :title="$appt('menu.index')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <q-list bordered separator v-if="functions">
      <q-item v-for="(fun,index) in functions" :key="index">
        <q-item-section avatar>
          <q-icon name="code"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ fun.name }}</q-item-label>
          <q-item-label>
            <q-badge>{{ fun.runtime }}</q-badge>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          {{ fun.createdAt }}
        </q-item-section>
      </q-item>
    </q-list>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "src/components/container/ClientRequiredAdaptiveLayout.vue";
import {Configuration, FunctionsApi} from '@dustlight/fun-client-axios-js'

export default {
  name: "Index",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      user_: null,
      token_: null,
      client_: null,
      functionsApi: null,
      functions: [],
      loading: false
    }
  },
  watch: {
    token_() {
      if (this.token_ == null) {
        this.functionsApi = null
        return
      }
      let cfg = new Configuration({
        basePath: "https://fun.dustlight.cn",
        accessToken: this.token_.access_token
      })
      this.functionsApi = new FunctionsApi(cfg)
    },
    client_() {
      this.loadFunctions()
    },
    functionsApi() {
      if (this.functionsApi) {
        this.loadFunctions()
      }
    }
  },
  methods: {
    loadFunctions() {
      if (this.functionsApi && !this.loading) {
        this.loading = true
        this.functionsApi.listFunctions(this.client_.cid)
          .then(res => {
            this.functions = res.data
          })
          .finally(() => this.loading = false)
      }
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
