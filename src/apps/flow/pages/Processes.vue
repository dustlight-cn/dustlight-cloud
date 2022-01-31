<template>
  <client-required-adaptive-layout
    :title="$appt('menu.processes')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <q-list bordered separator v-if="loading">
      <q-item v-for="index in 5" :key="index">
        <q-item-section avatar>
          <q-icon name="fas fa-code-branch"/>
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
      <q-list bordered separator v-if="processes && processes.data && processes.data.length > 0">
        <q-item v-for="(process,index) in processes.data" :key="index"
                clickable
                :to="{name:$options.app + '/process',params:{id:process.id}}"
                v-ripple>
          <q-item-section avatar>
            <q-icon name="fas fa-code-branch"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ process.name }}
              <q-badge>v{{ process.version }}</q-badge>
            </q-item-label>
            <q-item-label caption>
              {{ $moment(process.createdAt) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"/>
            <!--                      <q-btn round flat dense no-caps icon="link" @click="()=>openFunction(fun)" :disable="!config"/>-->
          </q-item-section>
          <!--          <q-item-section side>-->
          <!--            <q-btn :loading="functionDeleting.indexOf(fun.name) > -1" round dense icon="delete" flat-->
          <!--                   @click="()=>deleteFunction(fun)"/>-->
          <!--          </q-item-section>-->
        </q-item>
        <div v-if="processes && processes.count > pageSize " class="flex flex-center">
          <q-pagination
            v-model="page"
            :max="Math.ceil(processes.count/pageSize)"
            input
            color="primary"
          />
        </div>
      </q-list>
      <div class="text-center" v-else>
        {{ $appt("empty") }}
      </div>
    </div>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "src/components/container/ClientRequiredAdaptiveLayout.vue";


export default {
  name: "Processes",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      user_: null,
      token_: null,
      client_: null,
      processes: [],
      loading: false,
      pageSize: 10,
      page: 1
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
      this.page = 1
      this.loadProcesses()
    },
    client_() {
      this.page = 1
      this.loadProcesses()
    },
    page() {
      this.loadProcesses()
    }
  },
  methods: {
    loadProcesses() {
      if (!this.loading) {
        this.loading = true
        this.processesApi.getProcesses(undefined, this.client_.cid, this.page - 1, this.pageSize)
          .then(res => {
            this.processes = res.data
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
