<template>
  <client-required-adaptive-layout
    :title="$appt('menu.userTasks')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <div class="q-mb-md text-right">
      <q-select style="max-width: 600px; margin: 0 auto" :label="$appt('taskStatusLabel')" emit-value v-model="status"
                filled map-options :options="options">
      </q-select>
      <div class="q-mt-sm text-center">
        <q-chip v-if="name" :label="name" icon="account_tree" removable @remove="removeName"/>
        <q-chip v-if="version" removable @remove="removeVersion">
          Version: {{ version }}
        </q-chip>
      </div>
    </div>
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
                :to="{name:$options.app + '/user-task',params:{id:task.id}}"
                v-ripple>
          <q-item-section avatar>
            <q-icon v-if="task.completedAt" name="check"/>
            <q-icon v-else name="person"/>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>
              {{ task.id }}
            </q-item-label>
            <q-item-label caption>
              {{ task.processName }}
              <q-badge>{{ task.elementId }}</q-badge>
            </q-item-label>
            <q-item-label v-if="task.completedAt" caption>
              {{ $moment(task.completedAt) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"/>
          </q-item-section>

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
      status: this.$route.query.status || "",
      name: this.$route.query.name,
      version: this.$route.query.version,
      pageSize: 10,
      page: this.$route.query.page || 1,
      options: [
        {
          label: this.$appt('taskStatus.all'),
          value: ""
        },
        {
          label: this.$appt('taskStatus.active'),
          value: "ACTIVE"
        },
        {
          label: this.$appt('taskStatus.done'),
          value: "DONE"
        }
      ]
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
      this.page = 1
      this.loadTasks()
    },
    client_() {
      this.page = 1
      this.loadTasks()
    },
    page() {
      let obj = this.cloneQuery()
      obj.page = this.page
      this.$router.push({
        name: this.$route.name,
        query: obj
      })
    },
    status() {
      let obj = this.cloneQuery()
      obj.status = this.status
      this.$router.push({
        name: this.$route.name,
        query: obj
      })
    },
    "$route.query.name"() {
      this.page = 1
      this.name = this.$route.query.name
      this.version = this.$route.query.version
      this.status = this.$route.query.status || ""
      this.loadTasks()
    },
    "$route.query.version"() {
      this.page = 1
      this.name = this.$route.query.name
      this.version = this.$route.query.version
      this.status = this.$route.query.status || ""
      this.loadTasks()
    },
    "$route.query.status"() {
      this.page = 1
      this.name = this.$route.query.name
      this.version = this.$route.query.version
      this.status = this.$route.query.status || ""
      this.loadTasks()
    },
    "$route.query.page"() {
      this.name = this.$route.query.name
      this.version = this.$route.query.version
      this.status = this.$route.query.status || ""
      this.loadTasks()
    }
  },
  methods: {
    cloneQuery() {
      let obj = {}
      for (let key in this.$route.query)
        obj[key] = this.$route.query[key]
      return obj
    },
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
    },
    removeVersion() {
      let obj = this.cloneQuery()
      delete obj['version']
      this.$router.push({
        name: this.$route.name,
        query: obj
      })
    },
    removeName() {
      let obj = this.cloneQuery()
      delete obj['name']
      this.$router.push({
        name: this.$route.name,
        query: obj
      })
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
