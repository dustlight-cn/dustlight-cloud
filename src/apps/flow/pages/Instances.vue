<template>
  <client-required-adaptive-layout
    :title="$appt('menu.instances')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <q-list bordered separator v-if="loading">
      <q-item v-for="index in 5" :key="index">
        <q-item-section avatar>
          <q-skeleton type="text" width="2em"/>
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
          <q-item-label>
            <q-skeleton type="text" width="2em"/>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else>
      <q-list bordered separator v-if="instances && instances.data && instances.data.length > 0">
        <q-item v-for="(instance,index) in instances.data" :key="index"
                clickable
                :to="{name:$options.app + '/instance',params:{id:instance.id}}"
                v-ripple>
          <q-item-section avatar>
            <q-icon :name="$options.ext.getStatusIcon(instance.status)"
                    :color="$options.ext.getStatusColor(instance.status)"/>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>
              {{ instance.id }}
            </q-item-label>
            <q-item-label caption>
              {{ instance.name }}
              <q-badge>v{{ instance.version }}</q-badge>
            </q-item-label>
            <q-item-label caption>
              {{ $moment(instance.createdAt) }}
            </q-item-label>
          </q-item-section>
          <q-item-section v-if="instance.status == 'INCIDENT'">
            <q-item-label overline>{{ instance.error.type }}</q-item-label>
            <q-item-label caption>{{ instance.error.message }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"/>
            <!--                      <q-btn round flat dense no-caps icon="link" @click="()=>openFunction(fun)" :disable="!config"/>-->
          </q-item-section>
        </q-item>
        <div v-if="instances && instances.count > pageSize " class="flex flex-center">
          <q-pagination
            v-model="page"
            :max="Math.ceil(instances.count/pageSize)"
            input
            color="primary"
          />
        </div>
      </q-list>
      <div class="text-center" v-else>
        <div class="text-grey">
          <div>{{ $appt("emptyInstance") }}</div>
          <!--          <div class="q-mt-md"><q-btn no-caps color="primary" :label="$appt('create')" :to="{name: $options.app + '/create' }"></q-btn></div>-->
        </div>
      </div>
    </div>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "src/components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "Test",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      user_: null,
      token_: null,
      client_: null,
      loading: false,
      instances: null,
      pageSize: 10,
      page: 1
    }
  },
  watch: {
    token_() {
      this.page = 1
      this.loadInstances()
    },
    client_() {
      this.page = 1
      this.loadInstances()
    },
    page() {
      this.loadInstances()
    },
    "$route.query.name"(){
      this.page = 1
      this.loadInstances()
    },
    "$route.query.version"(){
      this.page = 1
      this.loadInstances()
    }
  },
  computed: {
    instancesApi() {
      return this.$options.ext.instancesApi(this.token_.access_token)
    }
  },
  methods: {
    getStatusColor(status) {
      return this.$options.ext.getStatusColor(status)
    },
    loadInstances() {
      if (!this.loading) {
        this.loading = true
        this.instancesApi.getInstances(this.$route.query.name, this.$route.query.version, undefined, this.page - 1, this.pageSize, this.client_.cid)
          .then(res => {
            this.instances = res.data
          })
          .catch(this.$throw)
          .finally(() => this.loading = false)
      }
    },
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
