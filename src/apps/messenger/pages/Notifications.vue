<template>
  <client-required-adaptive-layout
    :title="$appt('menu.notifications')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <div class="q-mb-sm text-center">
      <q-chip v-if="templateId" icon="wysiwyg" :label="templateId" removable @remove="()=> templateId = undefined"
              clickable
              @click="()=>pushToTemplate(templateId)"/>
      <q-chip v-if="channelId" icon="router" :label="channelId" removable @remove="()=> channelId = undefined"
              clickable
              @click="()=>pushToChannel(channelId)"/>
    </div>
    <q-list bordered separator v-if="loading">
      <q-item v-for="i in size" :key="i">
        <q-item-section avatar>
          <q-icon name="notifications"/>
        </q-item-section>
        <q-item-section>
          <q-skeleton type="text" width="2em"/>
        </q-item-section>
      </q-item>
    </q-list>
    <q-list style="word-break: break-all" bordered separator v-else-if="notifications && notifications.data.length > 0">
      <q-expansion-item v-for="(notification,index) in notifications.data" :key="index">
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="notifications"/>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>
              {{ notification.id }}
            </q-item-label>
            <q-item-label v-if="notification.sender">
              <q-chip dense v-if="userMap[notification.sender]">
                <auth-avatar size="22" :user="userMap[notification.sender]"/>
                {{
                  userMap[notification.sender].nickname && userMap[notification.sender].nickname.trim() ? userMap[notification.sender].nickname : userMap[notification.sender].username
                }}
              </q-chip>
              <div v-else>
                <q-icon name="person"/>
                {{ notification.sender }}
              </div>
            </q-item-label>

            <q-item-label v-else>
              <q-chip dense color="primary" text-color="white">
                <auth-client-logo size="22" :client="client"/>
                {{ client.name && client.name.trim() ? client.name.trim() : "System" }}
              </q-chip>
            </q-item-label>
            <q-item-label caption>
              <q-icon name="event"/>
              {{ $moment(notification.createdAt) }}
            </q-item-label>
            <q-item-label caption>
              <q-icon name="send"/>
              {{ $moment(notification.sentAt) }}
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>
              <q-btn dense flat no-caps icon="wysiwyg" :label="notification.templateId"
                     @click="()=>templateId=notification.templateId"/>
            </q-item-label>
            <q-item-label caption>
              <q-btn dense flat no-caps icon="router" :label="notification.channelId"
                     @click="()=>channelId=notification.channelId"/>
            </q-item-label>
          </q-item-section>
        </template>
        <template v-slot:default>
          <q-card>
            <q-card-section>
              <q-list separator>
                <q-item v-for="(val,key) in notification.content" :key="key">
                  <q-item-section>
                    <q-item-label overline>
                      {{ key }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>
                      {{ JSON.stringify(val) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </template>
      </q-expansion-item>
    </q-list>
    <no-results v-else/>

    <div v-if="notifications && notifications.count > size " class="flex flex-center">
      <q-pagination
        v-model="page"
        :max="Math.ceil(notifications.count/size)"
        input
        color="primary"
      />
    </div>

    <q-page-sticky :offset="[18,18]">
      <q-btn :to="{name:$options.app + '/new-notification',query:{ template: this.templateId,channel: this.channelId }}"
             color="primary" round icon="add"/>
    </q-page-sticky>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
import NoResults from "../../../components/common/NoResults";

export default {
  name: "Notifications",
  components: {NoResults, ClientRequiredAdaptiveLayout},
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
      notifications: null,
      userMap: []
    }
  },
  watch: {
    token_() {
      // this.page = 1
      this.loadNotifications()
    },
    client_() {
      // this.page = 1
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
      obj.channel = this.channelId
      this.$router.push({
        name: this.$route.name,
        query: obj
      })
    },
    "$route.query.page"() {
      this.page = this.$route.query.page || 1
      this.templateId = this.$route.query.template
      this.channelId = this.$route.query.channel
      this.loadNotifications()
    },
    "$route.query.template"() {
      this.page = this.$route.query.page || 1
      this.templateId = this.$route.query.template
      this.channelId = this.$route.query.channel
      this.loadNotifications()
    },
    "$route.query.channel"() {
      this.page = this.$route.query.page || 1
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
    /**
     *
     * @returns {UsersApi}
     */
    usersApi() {
      return this.$options.ext.usersApi(this.token_.access_token)
    }
  },
  methods: {
    cloneQuery() {
      let obj = {}
      for (let key in this.$route.query)
        obj[key] = this.$route.query[key]
      return obj
    },
    pushToTemplate(id) {
      console.log(id)
      this.$router.push({
        name: this.$options.app + "/template",
        params: {
          id: id
        }
      })
    },
    pushToChannel(id) {
      console.log(id)
      this.$router.push({
        name: this.$options.app + "/channel",
        params: {
          id: id
        }
      })
    },
    loadUsers(...uid) {
      if (!this.userMap[this.user_.uid])
        this.userMap[this.user_.uid] = this.user_
      let set = new Set
      uid.forEach(u => set.add(u))
      for (let id in this.userMap) {
        set.delete(id)
      }
      set.delete(null)
      if (set.size == 0)
        return
      this.usersApi.getUsers(Array.from(set))
        .then(res => {
          for (let i in res.data.data) {
            let u = res.data.data[i]
            this.userMap[u.uid] = u
          }
        })
        .catch(this.$throw)
    },
    loadNotifications() {
      if (this.loading)
        return
      this.loading = true
      this.notificationsApi.listNotification(this.templateId, this.channelId, this.page - 1, this.size, this.client_.cid)
        .then(res => {
          this.notifications = res.data
          let uids = new Set()
          res.data.data.forEach(n => uids.add(n.sender))
          uids.delete(this.user_.uid)
          this.userMap[this.user_.uid] = this.user_
          if (uids.size > 0) {
            this.loadUsers(...Array.from(uids))
          }
        })
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
