<template>
  <client-required-adaptive-layout
    :title="$appt('menu.channels')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <div class="text-subtitle1 q-mb-md">
      <q-icon name="router" size="2em"/>
      <span class="text-caption ">{{ channelId }}</span>
    </div>
    <q-form @submit="save" class="q-gutter-sm">
      <q-input :rules="rules" :loading="loading" filled :label="$appt('channelName')" v-model="channel.name"/>
      <q-input type="textarea" :rules="rules" :loading="loading" filled :label="$appt('channelDescription')"
               v-model="channel.description"/>

      <div class="q-mb-md">
        <div class="text-subtitle2">
          <q-icon name="group"/>
          {{ $appt("channelOwner") }}
        </div>
        <div class="q-gutter-sm">
          <q-chip v-for="(uid,index) in channel.owner" :key="index" removable @remove="()=>removeOwner(uid)">
            <template v-slot:default v-if="userMap[uid]">
              <auth-avatar :user="userMap[uid]"/>
              <span>{{
                  userMap[uid].nickname && userMap[uid].nickname.trim() ? userMap[uid].nickname : userMap[uid].username
                }}</span>
            </template>
            <template v-slot:default v-else>
              <q-avatar>
                <q-icon name="person"/>
              </q-avatar>
              {{ uid }}
            </template>
          </q-chip>
          <q-btn :loading="loading" round flat icon="add" @click="addOwner"/>
        </div>
      </div>

      <div class="q-mb-md">
        <div class="text-subtitle2">
          <q-icon name="group"/>
          {{ $appt("channelMember") }}
        </div>
        <div class="q-gutter-sm">
          <q-chip v-for="(uid,index) in channel.member" :key="index" removable @remove="()=>removeMember(uid)">
            <template v-slot:default v-if="userMap[uid]">
              <auth-avatar :user="userMap[uid]"/>
              <span>{{
                  userMap[uid].nickname && userMap[uid].nickname.trim() ? userMap[uid].nickname : userMap[uid].username
                }}</span>
            </template>
            <template v-slot:default v-else>
              <q-avatar>
                <q-icon name="person"/>
              </q-avatar>
              {{ uid }}
            </template>
          </q-chip>
          <q-btn :loading="loading" round flat icon="add" @click="addMember"/>
        </div>
      </div>
      <div v-if="channel" class="q-mt-lg q-mb-lg text-caption text-grey text-right">
        <div>
          <q-icon name="event"/>
          {{ $moment(channel.createdAt) }}
        </div>
        <div>
          <q-icon name="update"/>
          {{ $moment(channel.updatedAt) }}
        </div>
      </div>
      <div class="text-right q-gutter-sm">

        <q-btn v-if="!loading" flat @click="deleteChannel" icon="delete" color="negative" :loading="deleting"
               :label="$q.lang.label.remove"/>
        <q-btn icon="update" class="text-capitalize" type="submit" color="primary" :loading="loading"
               :label="$q.lang.label.update"
               no-caps/>
      </div>
    </q-form>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
import UserSelector from "../../../components/dialog/UserSelector";

export default {
  name: "Channel",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,
      loading: false,
      deleting: false,
      channel: {
        name: "",
        description: "",
        owner: [],
        member: [],
      },
      channelId: this.$route.params.id,
      rules: [
        val => val && val.trim().length > 0 || this.$appt("notEmpty")
      ],
      userMap: {}
    }
  },
  watch: {
    token_() {
      this.loadChannel()
    },
    client_() {
      this.loadChannel()
    }
  },
  computed: {
    /**
     *
     * @returns {ChannelsApi}
     */
    channelsApi() {
      return this.$options.ext.channelsApi(this.token_.access_token)
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
    loadUsers(...uids) {
      this.usersApi.getUsers(uids)
        .then(res => {
          for (let i in res.data.data) {
            let u = res.data.data[i]
            this.userMap[u.uid] = u
          }
        })
        .catch(this.$throw)
    },
    loadChannel() {
      if (this.loading)
        return

      this.loading = true
      this.channelsApi.getChannel(this.channelId, this.client_.cid)
        .then(res => {
          this.channel = res.data
          let uids = []
          if (this.channel.owner)
            uids.push(...this.channel.owner)
          if (this.channel.member)
            uids.push(...this.channel.member)
          let myId = this.user_.uid
          if (uids.indexOf(myId) > -1) {
            uids.splice(uids.indexOf(myId), 1)
          }
          this.userMap[myId] = this.user_
          if (uids.length > 0)
            this.loadUsers(...uids)
        })
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    save() {
      if (this.loading)
        return
      this.loading = true
      this.channelsApi.updateChannel(this.channelId, {
        name: this.channel.name,
        description: this.channel.description,
        owner: this.channel.owner,
        members: this.channel.member
      }, this.client_.cid)
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    deleteChannel() {
      if (this.deleting)
        return
      this.$q.dialog({
        title: this.$appt('deleteChannelTitle'),
        message: this.$appt('deleteChannelMsg', this.channel),
        cancel: {
          color: "grey",
          flat: true
        },
        ok: {
          color: "negative"
        }
      })
        .onOk(() => {
          if (this.deleting)
            return
          this.deleting = true
          this.channelsApi.deleteChannel(this.channelId, this.client_.cid)
            .then(res => {
              this.$router.push({
                name: this.$options.app + "/channels"
              })
            })
            .catch(this.$throw)
            .finally(() => this.deleting = false)
        })
    },
    addOwner() {
      this.$q.dialog({
        component: UserSelector,
        componentProps: {
          token: this.token_.access_token
        },
      })
        .onOk(user => {
          if (this.channel.owner == null)
            this.channel.owner = []
          if (this.channel.owner.indexOf(user.uid) == -1) {
            this.channel.owner.push(user.uid)
            this.userMap[user.uid] = user
          }
        })
    },
    removeOwner(uid) {
      this.channel.owner.splice(this.channel.owner.indexOf(uid), 1)
    },
    addMember() {
      this.$q.dialog({
        component: UserSelector,
        componentProps: {
          token: this.token_.access_token
        },
      })
        .onOk(user => {
          if (this.channel.member == null)
            this.channel.member = []
          if (this.channel.member.indexOf(user.uid) == -1) {
            this.channel.member.push(user.uid)
            this.userMap[user.uid] = user
          }
        })
    },
    removeMember(uid) {
      this.channel.member.splice(this.channel.member.indexOf(uid), 1)
    },
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
