<template>
  <AuthUserContext>
    <template v-slot="{user,token}">
      {{ "", user_ = user, token_ = token }}
      <q-btn :loading="loading" dense flat>
        <auth-client-logo v-if="currentClient && currentClient.cid" :client="currentClient"/>
        <q-icon name="apps" v-else/>
        <q-menu ref="menu" style="width: 300px">
          <user-client-list :user="user" :token="token"
                            @onSelected="onSelected"/>
        </q-menu>
      </q-btn>
    </template>
    <template v-slot:unauthorized>
      {{ "" }}
    </template>
  </AuthUserContext>
</template>

<script type="ts">
import {Configuration, ClientsApi} from "@dustlight/auth-client-axios-js"
import {useStore} from 'src/store';

export default {
  name: "ClientSelector",
  props: {
    apiEndpoint: {
      type: String,
      default() {
        return process.env.auth.config.apiEndpoint || "https://api.dustlight.cn"
      }
    },
  },
  data() {
    return {
      currentClient: null,
      loading: false,

      clientsApi: null,
      user_: null,
      token_: null,
      loadClientFlag: null
    }
  },
  watch: {
    token_() {
      if (this.token_ == null) {
        this.clientsApi = null
        return
      }
      let cfg = new Configuration({
        basePath: this.apiEndpoint,
        accessToken: () => this.token_ instanceof Promise ? this.token_ : (this.token_ instanceof Object ? this.token_.access_token : this.token_)
      })
      this.clientsApi = new ClientsApi(cfg)
      if (this.loadClientFlag) {
        this.loadClient(this.loadClientFlag)
      }
    },
    user_() {
      if (this.loadClientFlag) {
        this.loadClient(this.loadClientFlag)
      }
    },
    "$store.state.client.client"(){
      this.currentClient = this.$store.state.client.client
    }
  },
  methods: {
    onSelected(client) {
      if (client == null) {
        this.$refs.menu.hide()
        this.$store.commit("client/setClient",null)
        return
      }
      if (this.currentClient && this.currentClient.cid == client.cid) {
        this.$refs.menu.hide()
      }
      this.$store.commit("client/setClient",client)

      this.$refs.menu.hide()
    },
    loadClient(clientId) {
      if (this.loading || this.clientsApi == null || clientId == null || this.user_ == null) {
        if (!this.clientsApi || !this.user_) {
          this.loadClientFlag = clientId
        }
        if (clientId == null) {
          this.$store.commit("client/setClient",null)
        }
        return
      }

      this.loading = true
      this.clientsApi.getUserClient(this.user_.uid, clientId)
        .then(res => {
          this.$store.commit("client/setClient",res.data)
        })
        .finally(() => {
          this.loading = false
          this.loadClientFlag = null
        })
    }
  },
  mounted() {
    this.loadClient(this.$route.query.cid)
  }
}
</script>

<style scoped>

</style>
