<template>
  <client-required-adaptive-layout
    :title="$appt('menu.create')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}
    <q-form @submit="create" class="q-gutter-sm">
      <q-input v-model="model.name" filled :label="$appt('functionName')"
               :disable="loading"
               :rules="rules.notEmpty"/>
      <q-select v-model="model.runtime" filled :label="$appt('functionRuntime')" :options="options"
                :disable="loading"
                :rules="rules.notEmpty"
                @filter="loadRuntimes"/>
      <q-input v-model="model.handler" filled :label="$appt('functionHandler')"
               :disable="loading"
               :rules="rules.notEmpty"/>
      <q-file accept=".zip, application/x-zip-compressed" v-model="model.file" filled :label="$appt('functionFile')"
              :disable="loading"
              :rules="rules.notNull">
        <template v-slot:prepend>
          <q-icon name="attach_file"/>
        </template>
      </q-file>
      <div class="text-right q-mt-md">
        <q-btn no-caps type="submit" :loading="loading" color="primary" :label="$appt('create')"/>
      </div>
    </q-form>
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
      options: null,
      model: {
        name: "hello",
        handler: "sl_handler.handler",
        runtime: "nodejs14",
        file: null
      },
      loading: false,
      rules: {
        notNull: [(val) => val != null || ""],
        notEmpty: [(val) => val != null && val.trim().length > 0 || ""]
      }
    }
  },
  computed: {
    functionsApi() {
      return this.$options.ext.functionsApi(this.token_.access_token)
    }
  },
  methods: {
    create() {
      if (this.loading)
        return
      this.loading = true
      this.functionsApi.createFunction(this.model.name,
        this.model.file,
        this.model.runtime,
        this.model.handler,
        this.client_.cid)
        .then(res => {
          this.$router.push({name: this.$options.app + "/index"})
        })
        .catch(this.$throw)
        .finally(() => {
          this.loading = false
        })
    },
    loadRuntimes(val, update, abort) {
      if (this.options != null) {
        update()
        return
      }
      this.functionsApi.getRuntimes().then(res => {
        this.options = res.data
      })
        .catch(this.$throw)
        .finally(() => {
          update()
        })
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
