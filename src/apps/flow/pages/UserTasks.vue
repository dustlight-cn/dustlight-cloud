<template>
  <client-required-adaptive-layout
    :title="$appt('menu.userTasks')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <q-list bordered separator v-if="loading">
      <q-item v-for="index in pageSize" :key="index">
        <q-item-section avatar>
          <q-icon name="person"/>
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
      <q-list bordered separator v-if="tasks && tasks.data && tasks.data.length > 0">
        <q-item v-for="(task,index) in tasks.data" :key="index"
                clickable
                :to="{name:$options.app + '/task',params:{id:task.id}}"
                v-ripple>
          <q-item-section avatar>
            <q-icon name="person"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ task }}
              <!--              <q-badge>v{{ process.version }}</q-badge>-->
            </q-item-label>
            <!--            <q-item-label caption>-->
            <!--              {{ $moment(process.createdAt) }}-->
            <!--            </q-item-label>-->
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
        <div v-if="tasks && tasks.count > pageSize " class="flex flex-center">
          <q-pagination
            v-model="page"
            :max="Math.ceil(tasks.count/pageSize)"
            input
            color="primary"
          />
        </div>
      </q-list>
      <div class="text-center" v-else>
        <div class="text-grey">
          <div>{{ $appt("emptyTasks") }}</div>
        </div>
      </div>
    </div>

  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "UserTasks",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      user_: null,
      token_: null,
      client_: null,
      loading: false,
      tasks: null,
      status: this.$route.query.status,
      name: this.$route.query.name,
      version: this.$route.query.version,
      pageSize: 10,
      page: 1
    }
  },
  computed: {
    /**
     *
     * @returns {UserTasksApi}
     */
    userTasksApi() {
      return this.$options.ext.userTasksApi(this.token_.access_token)
    }
  },
  watch: {
    token_() {
      this.loadTasks()
    },
    client_() {
      this.loadTasks()
    }
  },
  methods: {
    loadTasks() {
      if (this.loading)
        return
      this.loading = true
      this.userTasksApi.getUserTasks(this.name, this.version, this.status, this.page - 1, this.pageSize, this.client_.cid)
        .then(res => this.tasks = res.data)
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    isDone(task) {
      return task && task.completedAt
    }
  }
}
</script>

<style scoped>

</style>
