<template>
  <client-required-adaptive-layout
    :title="$appt('menu.instances')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <!--    {{ process }}-->

    <div class="q-pb-md ">
      <div v-if="!instance" class="text-subtitle1 row">
        <q-skeleton type="text" width="4em"/>
      </div>
      <div v-else class="text-subtitle1">
        <q-icon name="fas fa-play"/>
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
          <q-btn icon="refresh" flat color="white" :label="$appt('retry')"/>
        </template>
      </q-banner>
    </div>

    <div v-if="instance">
      <!--      {{ instance }}-->
      <div v-if="loading" class="text-center">
        <q-spinner-gears color="primary" size="5em"/>
      </div>
      <bpm v-else-if="prcs" ref="bpm" :instance="true" :xml="prcs.data" :is-base64="true"/>
      <div class="q-mt-sm">
        <q-list bordered separator>
          <q-item v-for="(event,index) in instance.events" :key="index"
                  clickable
                  v-ripple>
            <q-item-section avatar>
              <q-badge>
                {{ event.elementType }}
              </q-badge>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ event.elementId }}
                <q-badge :color="$options.ext.getStatusColor(event.status)">
                  {{event.status}}
                </q-badge>
              </q-item-label>
              <q-item-label caption>
                {{event.createdAt}}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <!--      <div class=" q-mt-sm q-gutter-sm text-right">-->
      <!--        <q-btn no-caps :disable="saving" flat icon="refresh" @click="() => $refs.bpm.load()" :label="$appt('reset')"/>-->
      <!--        <q-btn no-caps :loading="saving" color="primary" icon="save" @click="saveProcess" :label="$appt('save')"/>-->
      <!--      </div>-->

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
      prcs: null
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
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
