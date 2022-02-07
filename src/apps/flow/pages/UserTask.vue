<template>
  <client-required-adaptive-layout
    :title="$appt('menu.userTasks')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}


    <div class="q-pb-md" v-if="loading.task || !task">
      <q-skeleton width="2em"/>
    </div>
    <div class="q-pb-md text-subtitle1" v-else>
      <q-icon size="2em" :name="task.completedAt ? 'check' :  'person'"/>
      <q-btn flat dense no-caps
             target="_blank"
             :to="{name: $options.app + '/' + 'process',params:{name: task.processName}}">
        {{ task.processName }}
      </q-btn>
      <span> / </span>
      <span class="text-caption">{{ task.id }}</span>
    </div>

    <div class="q-pb-md" v-if="loading.task">
      <q-spinner-gears size="4em"/>
    </div>
    <div class="q-pb-md" v-else>

      {{ task }}
    </div>

    <div class="q-pb-md" v-if="loading.form">
      <q-spinner-gears size="4em"/>
    </div>
    <div class="q-pb-md" v-else-if="form">
      <json-form :schema="form.schema"/>
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
        form: false
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
    }
  },
  mounted() {
    this.loadTask()
  }
}
</script>

<style scoped>

</style>
