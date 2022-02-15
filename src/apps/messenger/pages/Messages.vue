<template>
  <client-required-adaptive-layout
    :title="$appt('menu.messages')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <q-card-section style="height: calc(100% - 200px)" class="scroll">
      <q-separator/>
      <q-infinite-scroll class="full-height" @load="loadMore" :offset="50">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px"/>
          </div>
        </template>
        <template v-slot:default>
          <q-list separator>
            <q-item v-for="(msg,index) in chatList.messages" :key="index" clickable v-ripple
                    @click="()=> openChat(msg)">
              <q-item-section avatar>
                <auth-avatar :user="userMap[msg.sender]"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ getShowName(userMap[msg.sender] || msg.sender) }}
                </q-item-label>
                <q-item-label caption>
                  {{ msg.content }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>
                  {{ $moment(msg.createdAt) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right">
                </q-icon>
              </q-item-section>

              <q-badge color="red" floating rounded v-if="!msg.readAt"/>
            </q-item>
          </q-list>
        </template>
      </q-infinite-scroll>
      <q-separator/>
    </q-card-section>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
// import MessageStore from "../MessageStore";
import ChatDialog from "../components/ChatDialog";

export default {
  name: "Messages",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,
      ws: null,
      timer: null,
      chatList: {
        size: 10,
        messages: [],
        promise: null
      },
      messages: {},
      userMap: {},
      messageHook: null
    }
  },
  watch: {
    token_() {
      // this.parseStore()
      // this.loadChatList()
      this.connect()
    },
    client_() {
      // this.parseStore()
      // this.loadChatList()
      this.connect()
    },
    user_() {
      // this.parseStore()
    }
  },
  computed: {
    /**
     *
     * @returns {MessagesApi}
     */
    messagesApi() {
      return this.$options.ext.messagesApi(this.token_.access_token)
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
    getShowName(user) {
      return user ? (user.nickname && user.nickname.trim() ? user.nickname : (user.username && user.username.trim() ? user.username.trim() : user.uid)) : user;
    },
    loadUsers(...uid) {
      if (!this.userMap[this.user_.uid])
        this.userMap[this.user_.uid] = this.user_
      let set = new Set
      uid.forEach(u => set.add(u))
      for (let id in this.userMap) {
        set.delete(id)
      }
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
    // parseStore() {
    //   if (this.messageStore != null)
    //     this.messageStore.close()
    //   if (this.messageStoreLoading)
    //     return
    //   this.messageStoreLoading = true
    //   MessageStore.open(this.client_.cid, this.user_.uid)
    //     .then(store => this.messageStore = store)
    //     .catch(this.$throw)
    //     .finally(() => this.messageStoreLoading = false)
    // },
    /**
     *
     * @returns {WebSocket}
     */
    createWebSocket() {
      let basePath = new URL(this.$options.ext.basePath);
      return new WebSocket((basePath.protocol.toUpperCase() == "HTTPS:" ? "wss://" : "ws://") + basePath.host + basePath.pathname
        + "v1/connection?token=" + this.token_.access_token + "&cid=" + this.client_.cid)
    },
    closeWebSocket() {
      if (this.ws && this.ws.readyState != this.ws.CLOSED) {
        this.ws.onclose = null
        this.ws.close()
      }
      if (this.timer)
        clearInterval(this.timer)
    },
    onMessage(msg) {
      let data = JSON.parse(msg.data)
      let index = -1
      for (let i in this.chatList.messages) {
        if (this.chatList.messages[i].sender == data.sender) {
          index = i;
          break
        }
      }
      if (index > -1)
        this.chatList.messages.splice(index, 1)
      this.chatList.messages.splice(0, 0, data)
      console.log(this.chatList.messages)
      if (this.messageHook)
        this.messageHook(data)
    },
    connect() {
      this.closeWebSocket()

      let ws = this.createWebSocket();
      ws.onmessage = this.onMessage
      ws.onerror = (a) => console.warn(a)
      ws.onopen = () => {
      }

      ws.onclose = () => {
        if (this.timer)
          clearInterval(this.timer)
        this.timer = setInterval(this.connect, 1000,)
      }

      this.ws = ws;
    },
    /**
     *
     * @returns {Promise<unknown>|null}
     */
    loadChatList() {
      if (this.chatList.promise)
        return this.chatList.promise
      return this.chatList.promise = this.messagesApi.getChatList(this.chatList.messages.length == 0 ? undefined : this.chatList.messages[this.chatList.messages.length - 1].id,
        this.chatList.size,
        this.client_.cid)
        .then(res => {
          this.chatList.messages.push(...res.data)
          let uids = []
          res.data.forEach(msg => {
            uids.push(msg.sender)
          })
          this.loadUsers(...uids)
          return res.data
        })
        .catch(this.$throw)
        .finally(() => this.chatList.promise = null)
    },
    loadMore(index, done) {
      this.loadChatList()
        .then(res => {
          done(res.length < this.chatList.size)
        })
        .catch(this.$throw)
    },
    openChat(target) {
      let chatBox = this.$q.dialog({
        component: ChatDialog,
        parent: this,
        componentProps: {
          user: this.user_,
          target: this.userMap[target.sender],
          client: this.client_.cid,
          messagesApi: this.messagesApi,
          messageHook: (fn) => {
            this.messageHook = fn
          }
        }
      })
        .onDismiss(() => this.messageHook = null)
    }
  },
  mounted() {
  },
  unmounted() {
    this.closeWebSocket()
  }
}
</script>

<style scoped>

</style>
