<template>
  <client-required-adaptive-layout
    :title="$appt('menu.userTasks')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}


    <div class="q-pb-md" v-if="loading.task || !task">
      <q-skeleton width="2em"/>
    </div>
    <div class="q-pb-md text-subtitle1" v-else>
      <q-btn flat dense no-caps
             :icon="task.completedAt ? 'check' :  'person'"
             target="_blank"
             :label="task.processName"
             :to="{name: $options.app + '/' + 'process',params:{name: task.processName}}">
      </q-btn>
      <span> / </span>
      <q-btn flat dense no-caps
             icon="play_arrow"
             target="_blank"
             :label="task.instanceId"
             :to="{name: $options.app + '/' + 'instance',params:{id: task.instanceId}}">
      </q-btn>
      <span> / </span>
      <span class="text-caption">{{ task.id }}</span>
    </div>

    <div class="q-pb-md" v-if="loading.task">
      <q-spinner-gears size="4em"/>
    </div>
    <div class="q-pb-md text-subtitle1" v-else-if="task">
      {{ task.elementId }}
      <q-list separator>
        <q-item style="word-break: break-all" v-for="(val,key) in task.variables" :key="key">
          <q-item-section>
            <q-item-label overline>{{ key }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>{{ val }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="q-pb-md" v-if="loading.form">
      <q-spinner-gears size="4em"/>
    </div>
    <div class="q-pb-md" v-else-if="form">
      <json-form ref="jsonForm" :schema="form.schema"/>
    </div>
    <div class="text-right" v-if="task">
      <span class="text-caption text-grey" v-if="task.completedAt">{{ $moment(task.completedAt) }}</span>
      <q-btn :loading="loading.complete" @click="complete" v-else-if="form" :label="$q.lang.label.ok" color="primary"/>
    </div>

  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "UserTask",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      user_: null,
      token_: null,
      client_: null,
      taskId: this.$route.params.id,
      task: null,
      form: null,
      loading: {
        task: false,
        form: false,
        complete: false
      }
    }
  },
  computed: {
    /**
     *
     * @returns {UserTasksApi}
     */
    userTasksApi() {
      return this.$options.ext.userTasksApi(this.token_.access_token)
    },
    /**
     *
     * @returns {FormsApi}
     */
    formsApi() {
      return this.$options.ext.formsApi(this.token_.access_token)
    }
  },
  watch: {
    // taskId() {
    //   this.$router.push({name: this.$route.name, params: {id: this.taskId}})
    // },
    // "$route.params.id"() {
    //   this.taskId = this.$route.params.id
    //   this.loadTask()
    // }
    token_() {
      this.loadTask()
    },
    client_() {
      this.loadTask()
    }
  },
  methods: {
    loadForm(formName) {
      if (this.loading.form || this.client_ == null || this.token_ == null)
        return
      this.loading.form = true
      this.formsApi.getLatestForm(formName, this.client_.cid)
        .then(res => this.form = res.data)
        .catch(this.$throw)
        .finally(() => this.loading.form = false)
    },
    loadTask() {
      if (this.loading.task || this.client_ == null || this.token_ == null)
        return
      this.loading.task = true
      this.form = null
      this.userTasksApi.getUserTask(this.taskId, this.client_.cid)
        .then(res => {
          this.task = res.data
          this.loadForm(this.task.form)
        })
        .catch(this.$throw)
        .finally(() => this.loading.task = false)
    },
    complete() {
      if (this.loading.complete)
        return
      this.loading.complete = true
      this.userTasksApi.completeUserTask(this.task.id, this.$refs.jsonForm.getValue(), this.client_.cid)
        .then(() => this.task.completedAt = new Date().toISOString())
        .catch(this.$throw)
        .finally(() => this.loading.complete = false)
    }
  },
  mounted() {
    this.loadTask()
  }
}
</script>

<style scoped>

</style>
