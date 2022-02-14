<template>
  <client-required-adaptive-layout
    :title="$appt('menu.templates')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}
    <template-list :to="getTemplateRoute" :token="token" :client="client"/>
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
      token_: null
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
    }
  }
}
</script>

<style scoped>

</style>
