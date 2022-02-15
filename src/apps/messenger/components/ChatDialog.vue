<template>
  <q-dialog style="max-width: 800px;max-height: 600px" ref="dialog">
    <q-card class="full-width full-height">
      <q-card-section>
        <q-item class="q-pa-none q-ma-none">
          <q-item-section avatar>
            <auth-avatar :user="target"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ getShowName(target) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn @click="hide" round flat icon="close"/>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-separator />

      <q-card-section style="height: calc(100% - 155px)" class="scroll">
        <q-infinite-scroll class="full-height" @load="loadMore" reverse :offset="50">
          <template v-slot:loading="loading">
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px"/>
            </div>
          </template>
          <template v-slot:default>
            <div class="q-pb-sm">
              <q-chat-message
                v-for="(message,index) in messages" :key="message.id"
                :text="[message.content instanceof Object ? JSON.stringify(message.content) : message.content]"
                :sent="isMe(message)"
                :stamp="$moment(message.createdAt)"
              >
                <template v-slot:avatar>
                  <auth-avatar :user="getUserOrTarget(message)"/>
                </template>
              </q-chat-message>
            </div>
          </template>
        </q-infinite-scroll>
      </q-card-section>

      <q-separator/>

      <q-card-section>
        <q-input dense class="full-width" filled v-model="msg">
          <template v-slot:after>

            <q-btn color="primary" label="send"/>
          </template>
        </q-input>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import {MessagesApi} from "@dustlight/messenger-client-axios-js";

export default {
  name: "ChatDialog",
  props: {
    user: Object,
    target: Object,
    client: String,
    messagesApi: MessagesApi
  },
  data() {
    return {
      msg: "",
      messages: [],
      promise: null,
      size: 10
    }
  },
  methods: {
    isMe(message) {
      return message.sender == this.user.uid
    },
    getUserOrTarget(message) {
      if (message.sender == this.user.uid)
        return this.user
      return this.target
    },
    hide() {
      this.$refs.dialog.hide()
    },
    show() {
      this.$refs.dialog.show()
    },
    getShowName(user) {
      return user ? (user.nickname && user.nickname.trim() ? user.nickname : (user.username && user.username.trim() ? user.username.trim() : user.uid)) : user;
    },
    loadMessage() {
      if (this.promise)
        return this.promise
      return this.promise = this.messagesApi.getChat(this.target.uid,
        this.messages.length == 0 ? undefined : this.messages[0].id
        , this.size, this.client)
        .then(res => {
          let newMsgs = res.data.data;
          newMsgs.reverse()
          this.messages.splice(0, 0, ...newMsgs)
          // this.messages.push(...res.data.data)
          return res.data.data
        })
        .catch(this.$throw)
        .finally(() => this.promise = null)
    },
    loadMore(index, done) {
      this.loadMessage()
        .then(data => {
          done((data.length < this.size))
        })
        .catch(this.$throw)
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
