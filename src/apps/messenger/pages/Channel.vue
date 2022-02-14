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
          {{ $appt("owner") }}
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
          {{ $appt("member") }}
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
          if (uids.length > 0) {
            this.usersApi.getUsers(uids)
              .then(res => {
                for (let i in res.data.data) {
                  let u = res.data.data[i]
                  this.userMap[u.uid] = u
                }
                console.log(this.userMap)
              })
              .catch(this.$throw)
          }
        })
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    save() {
      // if (this.loading)
      //   return
      // this.loading = true
      // this.templatesApi.updateTemplate(this.templateId, {
      //   name: this.template.name,
      //   content: this.template.content
      // }, this.type, this.client_.cid)
      //   .catch(this.$throw)
      //   .finally(() => this.loading = false)
    },
    deleteChannel() {
      // if (this.deleting)
      //   return
      // this.$q.dialog({
      //   title: this.$appt('deleteTemplateTitle'),
      //   message: this.$appt('deleteTemplateMsg', this.template),
      //   cancel: {
      //     color: "grey",
      //     flat: true
      //   },
      //   ok: {
      //     color: "negative"
      //   }
      // })
      //   .onOk(() => {
      //     if (this.deleting)
      //       return
      //     this.deleting = true
      //     this.templatesApi.deleteTemplate(this.templateId, this.type, this.client_.cid)
      //       .then(res => {
      //         this.$router.push({
      //           name: this.$options.app + "/templates"
      //         })
      //       })
      //       .catch(this.$throw)
      //       .finally(() => this.deleting = false)
      //   })
    },
    addOwner() {

    },
    removeOwner(uid) {
      this.channel.owner.splice(this.channel.owner.indexOf(uid))
    },
    addMember() {

    },
    removeMember(uid) {
      this.channel.member.splice(this.channel.member.indexOf(uid))
    },
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
