<template>
  <client-required-adaptive-layout
    :title="$appt('menu.configs')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}
    <q-form class="q-gutter-sm" @submit="save">
      <div style="max-width: 600px;margin: 0 auto">
        <q-input :debounce="500" :loading="loading" :rules="rule.name" dense v-model="name" filled
                 :placeholder="$appt('key')">
          <template v-slot:prepend>
            <q-icon name="key"/>
          </template>
        </q-input>
        <div class="text-right">
          <q-toggle icon="settings" v-model="system" :label="$appt('system')"/>
        </div>
      </div>

      <q-input :debounce="500" :disable="loading" :rules="rule.value" v-model="value" outlined type="textarea"/>
      <div class="text-right q-gutter-sm">
        <q-btn no-caps :disable="loading" :label="$appt('format')" flat color='primary' icon="code" @click="format"/>
        <q-btn no-caps :loading="loading" :label="$appt('save')" color='primary' icon="save" type="submit"/>
      </div>
    </q-form>
  </client-required-adaptive-layout>
</template>

<script>
import ChannelList from "../../messenger/components/ChannelList";
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "Configs",
  components: {ChannelList, ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,
      loading: false,
      name: "",
      system: true,
      value: "",
      rule: {
        name: [val => val && val.trim().length > 0 || this.$appt('notEmpty')],
        value: [val => val && val.trim().length > 0 || this.$appt('notEmpty'),
          val => {
            try {
              JSON.parse(val)
              return true
            } catch (e) {
              return e.message
            }
          }]
      }
    }
  },
  computed: {
    /**
     *
     * @returns {ConfigurationsApi}
     */
    configsApi() {
      return this.$options.ext.configsApi(this.token_.access_token)
    }
  },
  watch: {
    token_() {
      this.load()
    },
    client_() {
      this.load()
    },
    user_() {
      this.load()
    },
    name() {
      this.load()
    },
    system() {
      this.load()
    }
  },
  methods: {
    load() {
      if (this.loading || !this.name)
        return
      this.loading = true
      this.configsApi.getConfiguration(this.name, this.client_.cid, this.system)
        .then((res) => {
          if (!res.data)
            res.data = {}
          this.value = JSON.stringify(res.data, null, "  ")
        })
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    format() {
      let obj = JSON.parse(this.value)
      this.value = JSON.stringify(obj, null, "  ")
    },
    save() {
      if (this.loading || !this.name)
        return
      let obj = JSON.parse(this.value)
      this.loading = true
      this.configsApi.setConfiguration(this.name.trim(), obj, this.client_.cid, this.system)
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
