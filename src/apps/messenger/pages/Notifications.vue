<template>
  <client-required-adaptive-layout
    :title="$appt('menu.notifications')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    {{ notifications }}
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "Notifications",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,
      loading: false,
      templateId: this.$route.query.template,
      channelId: this.$route.query.channel,
      page: this.$route.query.page || 1,
      size: 10,
      notifications: null
    }
  },
  watch: {
    token_() {
      this.page = 1
      this.loadNotifications()
    },
    client_() {
      this.page = 1
      this.loadNotifications()
    },
    page() {
      let obj = this.cloneQuery()
      obj.page = this.page
      this.$router.push({
        name: this.$route.name,
        query: obj
      })
    },
    templateId() {
      let obj = this.cloneQuery()
      obj.template = this.templateId
      this.$router.push({
        name: this.$route.name,
        query: obj
      })
    },
    channelId() {
      let obj = this.cloneQuery()
      obj.channel = this.channelId()
      this.$router.push({
        name: this.$route.name,
        query: obj
      })
    },
    "$route.query.page"() {
      this.page = this.$route.query.page
      this.templateId = this.$route.query.template
      this.channelId = this.$route.query.channel
      this.loadNotifications()
    },
    "$route.query.template"() {
      this.page = this.$route.query.page
      this.templateId = this.$route.query.template
      this.channelId = this.$route.query.channel
      this.loadNotifications()
    },
    "$route.query.channel"() {
      this.page = this.$route.query.page
      this.templateId = this.$route.query.template
      this.channelId = this.$route.query.channel
      this.loadNotifications()
    }
  },
  computed: {
    /**
     *
     * @returns {NotificationsApi}
     */
    notificationsApi() {
      return this.$options.ext.notificationsApi(this.token_.access_token)
    },
  },
  methods: {
    cloneQuery() {
      let obj = {}
      for (let key in this.$route.query)
        obj[key] = this.$route.query[key]
      return obj
    },
    loadNotifications() {
      if (this.loading)
        return
      this.loading = true
      this.notificationsApi.listNotification(this.templateId, this.channelId, this.page - 1, this.size, this.client_.cid)
        .then(res => this.notifications = res.data)
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
