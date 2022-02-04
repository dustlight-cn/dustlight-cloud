<template>
  <client-required-adaptive-layout
    :title="$appt('menu.instances')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <div class="q-pb-md ">
      <div v-if="!instance" class="text-subtitle1 row">
        <q-skeleton type="text" width="4em"/>
      </div>
      <div v-else class="text-subtitle1">
        <q-icon size="2em" :name="$options.ext.getStatusIcon(instance.status)" :color="$options.ext.getStatusColor(instance.status)"/>
        {{ instance.name }}
        <q-badge>
          v{{ instance.version }}
        </q-badge>
        <span> / </span>
        <span class="text-caption">{{ $route.params.id }}</span>
      </div>

      <q-banner v-if="instance && instance.error" inline-actions class="text-white bg-red">
        <q-item-section>
          <q-item-label overline class="text-white">{{ instance.error.type }}</q-item-label>
          <q-item-label>{{ instance.error.message }}</q-item-label>
        </q-item-section>
        <template v-slot:action>
          <q-btn :loading="resolving" icon="refresh" flat color="white" :label="$appt('retry')" @click="resolve"/>
        </template>
      </q-banner>
    </div>

    <div v-if="instance">
      <!--      {{ instance }}-->
      <div v-if="loading" class="text-center">
        <q-spinner-gears color="primary" size="5em"/>
      </div>
      <bpm v-else-if="prcs" ref="bpm" :instance="instance" :xml="prcs.data" :is-base64="true"/>
      <div class="q-mt-sm">
        <q-list bordered separator>
          <q-expansion-item :group="instance.name + '_events'" v-for="(event,index) in computedEvents" :key="index"
                            @before-show="()=>loadVariables(event)">
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon :name="$options.ext.getStatusIcon(event.status)"
                        :color="$options.ext.getStatusColor(event.status)"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ event.elementId }}
                  <q-badge>
                    {{ event.elementType }}
                  </q-badge>
                </q-item-label>
              </q-item-section>
              <q-item-section v-if="event.error">
                <q-item-label overline>{{ event.error.type }}</q-item-label>
                <q-item-label caption>{{ event.error.message }}</q-item-label>
              </q-item-section>
            </template>
            <template v-slot:default>
              <q-card>
                <q-card-section>
                  <div class="text-subtitle2">{{ $appt('createdAt') }}</div>
                  <div class="text-caption">{{ $moment(event.createdAt) }}</div>
                  <div class="text-subtitle2">{{ $appt('updatedAt') }}</div>
                  <div class="text-caption">{{ $moment(event.updatedAt) }}</div>
                </q-card-section>
                <q-card-section>
                  <div class="text-subtitle2">{{ $appt('variables') }}</div>
                  <q-form class="q-gutter-sm">
                    <div class="text-center" v-if="variableLoading.indexOf(event.elementId) > -1">
                      <q-spinner-gears color="primary" size="4em"/>
                    </div>
                    <div class="q-gutter-sm" v-else="variablesMap[event.elementId]">
                      <div v-for="(variable,index) in variablesMap[event.elementId]" :key="index">
                        <q-input filled :label="index" v-model="variablesMap[event.elementId][index]"/>
                      </div>
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
            </template>
          </q-expansion-item>
        </q-list>
      </div>
      <div class=" q-mt-sm q-gutter-sm text-right">
        <q-btn v-if="instance.status != 'COMPLETED' && instance.status != 'CANCELED' " no-caps :loading="canceling" flat
               :icon="$options.ext.getStatusIcon('CANCELED')" @click="cancel" :label="$appt('cancel')"/>
      </div>

    </div>
    <div v-else class="text-center">
      <q-spinner-gears color="primary" size="5em"/>
    </div>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "src/components/container/ClientRequiredAdaptiveLayout";
import Bpm from "../components/Bpm";

export default {
  name: "Instance",
  components: {Bpm, ClientRequiredAdaptiveLayout},
  data() {
    return {
      user_: null,
      token_: null,
      client_: null,
      loading: false,
      instance: null,
      prcs: null,
      variablesMap: {},
      variableLoading: [],
      canceling: false,
      resolving: false
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
    instancesAPi() {
      return this.$options.ext.instancesApi(this.token_.access_token)
    },
    computedEvents() {
      if (this.instance == null || this.instance.events == null)
        return null;
      let events = {}
      this.instance.events.forEach(event => {
        if (event.elementType == "SEQUENCE_FLOW")
          return;
        if(event.status == "RESOLVED")
          return
        if (events[event.elementId] && events[event.elementId].error == null) {
          events[event.elementId].error = event.error
          events[event.elementId].status = event.status
          return;
        }
        events[event.elementId] = event
      })
      return events;
    }
  },
  watch: {
    token_() {
      this.loadInstance()
    },
    client_() {
      this.loadInstance()
    }
  },
  methods: {
    loadInstance() {
      if (this.loading)
        return
      this.loading = true
      let p = this.instancesAPi.getInstance(this.$route.params.id, this.client_.cid)
      p.then(res => {
        let instance = res.data
        this.instance = instance
        return this.processesApi.getProcess1(instance.name, instance.version, this.client_.cid)
          .then(res => this.prcs = res.data)
      })
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    loadVariables(event) {
      if (this.variableLoading.indexOf(event.elementId) > -1 || this.variablesMap[event.elementId])
        return
      this.variableLoading.push(event.elementId)
      this.instancesAPi.getInstanceVariables(this.instance.id, event.id, this.client_.cid)
        .then(res => this.variablesMap[event.elementId] = res.data)
        .catch(this.$throw)
        .finally(() => this.variableLoading.splice(this.variableLoading.indexOf(event.elementId), 1))
    },
    cancel() {
      if (this.canceling)
        return
      this.canceling = true
      this.instancesAPi.cancelInstance(this.instance.id, this.client_.cid)
        .then(res => this.loadInstance())
        .catch(this.$throw)
        .finally(() => this.canceling = false)
    },
    resolve() {
      if (this.resolving)
        return
      this.resolving = true
      let incidentElement = null
      this.instance.events.forEach(event => {
        if (event.status == 'INCIDENT')
          incidentElement = event
      })
      this.instancesAPi.resolve(this.instance.id, incidentElement.id, this.client_.cid)
        .then(() => this.loadInstance())
        .catch(this.$throw)
        .finally(() => this.resolving = false)
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
