<template>
  <q-dialog ref="dialog">
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

      <q-separator/>

      <q-card-section ref="scroll" style="height: calc(100% - 155px)" class="scroll">

        <q-infinite-scroll class="full-height" @load="loadMore" reverse :offset="50" :scroll-target="$refs.scroll">
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
        <q-form @submit="send">
          <q-input @keydown.enter="send" dense class="full-width" filled v-model="msg">
            <template v-slot:before>
              <q-btn color="primary"  dense flat round>
                <span style="font-size: 1.5em">😀</span>
                <q-menu style="width: calc(50%)">
                  <q-card>
                    <q-card-section class="scroll-x">
                      <q-btn @click="()=>msg += em" v-for="em in emoji" :key="em" flat round dense>
                        <span style="font-size: 1.5em">{{ em }}</span>
                      </q-btn>
                    </q-card-section>
                  </q-card>
                </q-menu>
              </q-btn>
            </template>
            <template v-slot:after>
              <q-btn @click="send" type="submit" :loading="sending" color="primary" label="Send" no-caps/>
            </template>
          </q-input>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import {MessagesApi} from "@dustlight/messenger-client-axios-js";
import emoji from './emoji'

export default {
  name: "ChatDialog",
  props: {
    user: Object,
    target: Object,
    client: String,
    messagesApi: MessagesApi,
    messageHook: Function
  },
  data() {
    return {
      msg: "",
      messages: [],
      promise: null,
      size: 10,
      sending: false,
      emoji: emoji
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
    pushMessage(...msg) {
      let set = new Set
      for (let i in this.messages) {
        set.add(this.messages[i].id)
      }
      let msgs = []
      msg.forEach(m => {
        if (!set.has(m.id))
          msgs.push(m)
      })
      this.messages.push(...msgs)

      // this.$nextTick(() => this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight)
      // if (this.$refs.scroll.scrollTop >= this.$refs.scroll.scrollHeight - 50) {
      // }
    },
    loadMessage() {
      if (this.messageHook) {
        this.messageHook((msg) => {
            if (msg &&
              ((msg.receiver == this.user.uid && msg.sender == this.target.uid) ||
                (msg.receiver == this.target.uid && msg.sender == this.user.uid))) {
              this.pushMessage(msg)
            }
          }
        )
      }
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
    },
    send() {
      if (this.sending || this.msg.length == 0)
        return
      this.sending = true
      this.messagesApi.sendMessage({
        receiver: this.target.uid,
        content: this.msg,
      }, undefined, this.client)
        .then(res => {
          this.pushMessage(...res.data)
          this.msg = ""
        })
        .catch(this.$throw)
        .finally(() => this.sending = false)
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
