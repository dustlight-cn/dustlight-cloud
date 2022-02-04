<template>
  <client-required-adaptive-layout
    :title="$appt('menu.processes')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <!--    {{ process }}-->
    <div class="q-pb-md">
      <q-btn-dropdown v-if="this.$route.params.name" flat no-caps>
        <template v-slot:label class="text-subtitle1">
          <q-icon name="fas fa-code-branch"/>
          {{ $route.params.name }}
          <q-badge class="q-ml-xs">
            <q-skeleton v-if="loading || !prcs" type="text" width="1em"/>
            <span v-else>v{{ prcs.version }}</span>
          </q-badge>
        </template>
        <template v-slot:default>
          <q-list v-if="prcs">
            <q-item :disable="loading"
                    :to="{name: $options.app + '/instances',query:{name: prcs.name,version: prcs.version}}">
              <q-item-section avatar>
                <q-icon name="fas fa-eye"/>
              </q-item-section>
              <q-item-section>
                {{ $appt('checkInstance') }}
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple v-close-popup :disable="loading" @click="run">
              <q-item-section avatar>
                <q-icon name="fas fa-play"/>
              </q-item-section>
              <q-item-section>
                {{ $appt('run') }}
              </q-item-section>
            </q-item>
          </q-list>
        </template>
      </q-btn-dropdown>
      <div v-else>
        <q-icon name="fas fa-code-branch"/>
        {{ $appt('newProcess') }}
      </div>
    </div>
    <div v-if="loading" class="text-center">
      <q-spinner-gears color="primary" size="5em"/>
    </div>
    <div v-else-if="prcs">

      <bpm ref="bpm" :xml="prcs.data" :is-base64="true"/>
      <div class="row q-mt-sm q-gutter-sm text-right">
        <q-space/>
        <q-btn no-caps :disable="saving" flat icon="refresh" @click="() => $refs.bpm.load()" :label="$appt('reset')"/>
        <q-btn no-caps :loading="saving" color="primary" icon="save" @click="saveProcess" :label="$appt('save')"/>
      </div>
    </div>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "src/components/container/ClientRequiredAdaptiveLayout";
import Bpm from "../components/Bpm";
import RunProcess from "../components/RunProcess";

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
      saving: false,
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
    },
    /**
     *
     * @returns {InstancesApi}
     */
    instancesApi() {
      return this.$options.ext.instancesApi(this.token_.access_token)
    }
  },
  watch: {
    token_() {
      this.loadProcess()
    },
    client_() {
      this.loadProcess()
    },
    "$route.params.name"() {
      this.loadProcess()
    }
  },
  methods: {
    loadProcess() {
      if (this.loading || !this.client_ || !this.token_)
        return
      if (!this.$route.params.name) {
        this.prcs = {
          data: ""
        }
        return;
      }
      this.loading = true
      let p = this.version ?
        this.processesApi.getProcess1(this.$route.params.name, this.version, this.client_.cid) :
        this.processesApi.getProcess(this.$route.params.name, this.client_.cid)
      p.then(res => this.prcs = res.data)
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    saveProcess() {
      if (this.saving)
        return
      this.saving = true
      this.$refs.bpm.export()
        .then(res => this.processesApi.createProcess(res.xml, this.client_.cid, false)
          .then(() => this.$router.push({name: this.$options.app + "/process", params: {name: res.name}})))
        .catch(this.$throw)
        .finally(() => this.saving = false)
    },
    run() {
      this.$q.dialog({
        component: RunProcess,
        parent: this,
        componentProps: {
          title: this.$appt('run'),
          variablesLabel: this.$appt('variables'),
          nameLabel: this.$appt('variableName'),
          valueLabel: this.$appt('variableValue'),
          rules: [ val => val && val.trim().length > 0 || this.$appt('notEmpty')],
          api: (variables) => this.instancesApi.createInstance(this.prcs.name, variables, this.client_.cid)
            .catch(this.$throw)
        }
      })
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
