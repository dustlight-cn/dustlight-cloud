<template>
  <client-required-adaptive-layout
    :title="$appt('menu.templates')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}
    <template-list push-route-with-page :to="getTemplateRoute" :token="token" :client="client"/>


    <q-page-sticky :offset="[18,18]">
      <q-btn :loading="creating" @click="newTemplate" color="primary" round icon="add"/>
    </q-page-sticky>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
import TemplateList from "../components/TemplateList";

export default {
  name: "Templates",
  components: {TemplateList, ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,
      creating: false
    }
  },
  computed: {
    /**
     *
     * @returns {TemplatesApi}
     */
    templatesApi() {
      return this.$options.ext.templatesApi(this.token_.access_token)
    }
  },
  methods: {
    getTemplateRoute(template) {
      return {
        name: this.$options.app + "/template",
        params: {
          id: template.id
        }
      }
    },
    newTemplate() {
      if (this.creating)
        return
      this.$q.dialog({
        cancel: true,
        title: this.$appt('newTemplate'),
        prompt: {
          label: this.$appt('templateName'),
          isValid: val => val && val.trim().length > 0
        }
      }).onOk(val => {
        if (this.creating)
          return
        this.creating = true
        this.templatesApi.createTemplate({
          name: val,
          content: ""
        }, "EMAIL", this.client_.cid)
          .then(res => {
            this.$router.push({
              name: this.$options.app + "/template",
              params: {
                id: res.data.id
              }
            })
          })
          .catch(this.$throw)
          .finally(() => this.creating = false)
      })
    }
  }
}
</script>

<style scoped>

</style>
