<template>
  <client-required-adaptive-layout
    :title="$appt('menu.index')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <q-list bordered separator v-if="loading">
      <q-item v-for="index in 5" :key="index">
        <q-item-section avatar>
          <q-icon name="code"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" width="2em"/>
            <q-badge>
              <q-skeleton type="text" width="1em"/>
            </q-badge>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label><q-skeleton type="text" width="2em" /> </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else>
      <q-list bordered separator v-if="functions && functions.length > 0">
        <q-item v-for="(fun,index) in functions" :key="index">
          <q-item-section avatar>
            <q-icon name="code"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ fun.name }}
              <q-badge>{{ fun.runtime }}</q-badge>
            </q-item-label>
            <q-item-label caption>
              {{ $moment(fun.createdAt) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn round flat target="_blank" :href="openFunctionUrl(fun)" dense no-caps icon="link"
                   :disable="!config"/>
          </q-item-section>
          <q-item-section side>
            <q-btn :loading="functionDeleting.indexOf(fun.name) > -1" round dense icon="delete" flat
                   @click="()=>deleteFunction(fun)"/>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="text-center" v-else>
        <div class="text-grey">
          <div>{{ $appt("empty") }}</div>
          <div class="q-mt-md"><q-btn no-caps color="primary" :label="$appt('create')" :to="{name: $options.app + '/create' }"></q-btn></div>
        </div>
      </div>
    </div>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "src/components/container/ClientRequiredAdaptiveLayout.vue";

export default {
  name: "Index",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      user_: null,
      token_: null,
      client_: null,
      functions: [],
      loading: false,
      functionDeleting: [],
      config: null
    }
  },
  computed: {
    functionsApi() {
      return this.$options.ext.functionsApi(this.token_.access_token)
    },
    configsApi() {
      return this.$options.ext.configsApi
    }
  },
  watch: {
    token_() {
      this.loadFunctions()
    },
    client_() {
      this.loadFunctions()
    }
  },
  methods: {
    openFunctionUrl(fun) {
      let id = process.env.auth.config.clientId == this.client_.cid ? "system" : this.client_.cid
      return (this.config.hostFormat.replace("%s", id) + "/" + fun.name)
    },
    loadFunctions() {
      if (this.functionsApi && !this.loading) {
        this.loading = true
        this.functionsApi.listFunctions(this.client_.cid)
          .then(res => {
            this.functions = res.data
          })
          .catch(this.$throw)
          .finally(() => this.loading = false)
      }
    },
    deleteFunction(fun) {
      this.$q.dialog({
        title: this.$appt("delete"),
        message: this.$appt("deleteMessage", fun),
        cancel: true
      }).onOk(() => {
        this.functionDeleting.push(fun.name)
        this.functionsApi.deleteFunction(fun.name, this.client_.cid)
          .then(() => {
            this.functions.splice(this.functions.indexOf(fun), 1)
          })
          .catch(this.$throw)
          .finally(() => {
            this.functionDeleting.splice(this.functionDeleting.indexOf(fun.name), 1)
          })
      })

    }
  },
  mounted() {
    this.configsApi.getConfiguration()
      .then(res => {
        this.config = res.data
      })
      .catch(this.$throw)
  }
}
</script>

<style scoped>

</style>
