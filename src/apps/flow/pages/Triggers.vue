<template>
  <client-required-adaptive-layout
    :title="$appt('menu.triggers')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}


    <div class="q-gutter-sm row" style="max-width: 800px;margin: 0 auto">
      <q-input :label="$appt('triggerKey')" clearable class="col" :loading="loading" :debounce="500" filled
               v-model="key"/>

      <q-select :label="$appt('triggerEvent')" class="col-auto" filled :loading="loading" v-model="opt"
                :options="options"
                @filter="loadOperation"/>
    </div>
    <q-separator class="q-mt-sm q-mb-sm"/>
    <div class="q-mt-md">
      <q-chip :disable="loading" v-for="(prcs,index) in processes" icon="account_tree" removable clickable :key="index"
              :label="prcs"
              @remove="()=>remove(prcs)" @click="()=>toProcess(prcs)"/>

      <q-btn v-if="key && opt" :loading="loading" flat round icon="add" color="grey" @click="add"/>
    </div>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "Trigger",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      user_: null,
      token_: null,
      client_: null,
      loading: false,
      key: this.$route.query.key || "",
      opt: this.$route.query.opt || "",
      processes: [],
      options: null
    }
  },
  computed: {
    /**
     *
     * @returns {TriggersApi}
     */
    triggersApi() {
      return this.$options.ext.triggersApi(this.token_.access_token)
    }
  },
  watch: {
    token_() {
      this.loadTriggers()
    },
    client_() {
      this.loadTriggers()
    },
    "$route.query.key"() {
      this.key = this.$route.query.key
      this.processes = []
      this.loadTriggers()
    },
    "$route.query.opt"() {
      this.opt = this.$route.query.opt
      this.processes = []
      this.loadTriggers()
    },
    key() {
      let obj = {}
      for (let key in this.$route.query)
        obj[key] = this.$route.query[key]
      obj.key = this.key
      this.$router.push({name: this.$route.name, query: obj})
    },
    opt() {
      let obj = {}
      for (let key in this.$route.query)
        obj[key] = this.$route.query[key]
      obj.opt = this.opt
      this.$router.push({name: this.$route.name, query: obj})
    }
  },
  methods: {
    loadTriggers() {
      if (this.loading || !this.opt || !this.key)
        return
      this.loading = true
      this.triggersApi.getTriggerProcess(this.key, this.opt, this.client_.cid)
        .then(res => this.processes = res.data)
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    loadOperation(val, update, abort) {
      if (this.options != null) {
        update()
        return
      }
      this.triggersApi.getOperations()
        .then(res => this.options = res.data)
        .catch(this.$throw)
        .finally(() => update())
    },
    remove(prcs) {
      if (this.loading)
        return
      this.loading = true
      let newArr = []
      this.processes.forEach(pr => {
        if (pr != prcs) newArr.push(pr)
      })
      this.triggersApi.setTriggerProcess(this.key, this.opt, newArr, this.client_.cid)
        .then(res => this.processes = newArr)
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    add() {
      if (this.loading)
        return
      this.$q.dialog({

        title: this.$appt('addTrigger'),
        html: true,
        message: `${this.$appt('triggerKey')}: ${this.key.trim()}<br>${this.$appt('triggerEvent')}: ${this.opt.trim()}`,
        cancel: true,
        prompt: {
          isValid: val => val && val.trim().length > 0 || this.$appt('notEmpty'),
          label: this.$appt('processName')
        },
      }).onOk(val => {
        if (this.processes.indexOf(val) > -1)
          return
        this.loading = true
        let newArr = []
        this.processes.forEach(pr => {
          newArr.push(pr)
        })
        newArr.push(val)
        this.triggersApi.setTriggerProcess(this.key, this.opt, newArr, this.client_.cid)
          .then(res => this.processes = newArr)
          .catch(this.$throw)
          .finally(() => this.loading = false)
      })
    },
    toProcess(prcs) {
      this.$router.push({
        name: this.$options.app + "/process",
        params: {
          name: prcs
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
