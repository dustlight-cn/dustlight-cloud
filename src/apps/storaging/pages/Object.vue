<template>
  <client-required-adaptive-layout
    :title="$appt('menu.objects')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}
    <q-file
      v-show="false"
      ref="file"
      hidden
      hide-bottom-space
      hide-hint
      borderless
      v-model="file"
    />
    <q-form @submit="update" class="q-gutter-sm">
      <q-input v-model="object.id" readonly filled :label="$appt('objectId')"/>
      <q-input :rules="rule" :loading="loading" v-model="object.name" filled :label="$appt('objectName')"/>
      <q-input :rules="rule" :loading="loading" v-model="object.description" type="textarea" filled
               :label="$appt('objectDescription')"/>
      <q-item>
        <q-item-section>
          <q-item-label>{{ $appt("objectOwner") }}</q-item-label>
          <q-item-label>
            <q-chip v-for="(uid,index) in object.owner" :key="index" removable @remove="()=>removeOwner(uid)">
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
            <q-btn :loading="loading" icon="add" round flat @click="addOwner"/>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>{{ $appt("objectCanRead") }}</q-item-label>
          <q-item-label>
            <q-chip v-for="(uid,index) in object.canRead" :key="index" removable @remove="()=>removeCanRead(uid)">
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
            <q-btn :loading="loading" icon="add" round flat @click="addCanRead"/>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>{{ $appt("objectCanWrite") }}</q-item-label>
          <q-item-label>
            <q-chip v-for="(uid,index) in object.canWrite" :key="index" removable @remove="()=>removeCanWrite(uid)">
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
            <q-btn :loading="loading" icon="add" round flat @click="addCanWrite"/>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>{{ $appt("objectSize") }}</q-item-label>
          <q-item-label caption>
            {{ $options.ext.byteString(object.size) }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="object.type">
        <q-item-section>
          <q-item-label>{{ $appt("objectType") }}</q-item-label>
          <q-item-label caption>
            {{ object.type }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label caption v-if="object.createdAt">
            <q-icon name="event"/>
            {{ $moment(object.createdAt) }}
          </q-item-label>

          <q-item-label caption v-if="object.updatedAt">
            <q-icon name="update"/>
            {{ $moment(object.updatedAt) }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <div class="text-right q-gutter-sm">
        <q-btn flat :loading="deleting || loading" color="negative" icon="delete" :label="$appt('delete')"
               @click="deleteObject"/>
        <q-btn flat :disable="deleting" :loading="uploading || loading" color="accent" icon="upload"
               :label="$appt('upload')" @click="upload"/>
        <q-btn flat :disable="deleting" :loading="downloading || loading" color="secondary" icon="download"
               :label="$appt('download')" @click="download"/>
        <q-btn :disable="deleting" :loading="loading" color="primary" icon="update" :label="$q.lang.label.update"
               type="submit"/>
      </div>
    </q-form>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
import NoResults from "../../../components/common/NoResults";
import UserSelector from "../../../components/dialog/UserSelector";

export default {
  name: "Object",
  components: {NoResults, ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,
      object: {
        id: this.$route.params.id,
        name: "",
        description: "",
        owner: [],
        canRead: [],
        canWrite: []
      },
      file: null,
      loading: false,
      objectId: this.$route.params.id,
      userMap: {},
      rule: [val => val && val.trim().length > 0 || this.$appt('notEmpty')],
      uploading: false,
      downloading: false,
      deleting: false
    }
  },
  computed: {
    /**
     *
     * @returns {ObjectsApi}
     */
    objectsApi() {
      return this.$options.ext.objectsApi(this.token_.access_token)
    },
    /**
     *
     * @returns {UsersApi}
     */
    usersApi() {
      return this.$options.ext.usersApi(this.token_.access_token)
    }
  },
  watch: {
    token_() {
      this.loadObject()
    },
    client_() {
      this.loadObject()
    },
    user_() {
      this.loadObject()
    },
    file() {
      this.doUpload()
    }
  },
  methods: {
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
    loadObject() {
      if (this.loading)
        return
      this.loading = true
      this.objectsApi.getObject(this.objectId, this.client_.cid, true)
        .then(res => {
          this.object = res.data
          let uids = []
          if (res.data.owner)
            uids.push(...res.data.owner)
          if (res.data.canRead)
            uids.push(...res.data.canRead)
          if (res.data.canWrite)
            uids.push(...res.data.canWrite)
          this.loadUsers(...uids)
        })
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    removeOwner(uid) {
      let index = this.object.owner.indexOf(uid)
      if (index > -1)
        this.object.owner.splice(index, 1)
    },
    removeCanRead(uid) {
      let index = this.object.canRead.indexOf(uid)
      if (index > -1)
        this.object.canRead.splice(index, 1)
    },
    removeCanWrite(uid) {
      let index = this.object.canWrite.indexOf(uid)
      if (index > -1)
        this.object.canWrite.splice(index, 1)
    },
    addOwner() {
      this.$q.dialog({
        component: UserSelector,
        componentProps: {
          token: this.token_.access_token
        }
      }).onOk(usr => {
        let exists = false
        if (!this.object.owner)
          this.object.owner = []
        if (this.object.owner.indexOf(usr.uid) == -1) {
          this.object.owner.push(usr.uid)
          this.userMap[usr.uid] = usr
        }
      })
    },
    addCanWrite() {
      this.$q.dialog({
        component: UserSelector,
        componentProps: {
          token: this.token_.access_token
        }
      }).onOk(usr => {
        let exists = false
        if (!this.object.canWrite)
          this.object.canWrite = []
        if (this.object.canWrite.indexOf(usr.uid) == -1) {
          this.object.canWrite.push(usr.uid)
          this.userMap[usr.uid] = usr
        }
      })
    },
    addCanRead() {
      this.$q.dialog({
        component: UserSelector,
        componentProps: {
          token: this.token_.access_token
        }
      }).onOk(usr => {
        let exists = false
        if (!this.object.canRead)
          this.object.canRead = []
        if (this.object.canRead.indexOf(usr.uid) == -1) {
          this.object.canRead.push(usr.uid)
          this.userMap[usr.uid] = usr
        }
      })
    },
    update() {
      if (this.loading)
        return
      this.loading = true
      this.objectsApi.putObject(this.objectId, {
        name: this.object.name,
        description: this.object.description,
        owner: this.object.owner,
        canWrite: this.object.canWrite,
        canRead: this.object.canRead,
      }, this.client_.cid, true)
        .then(res => {
          this.object.updatedAt = new Date().toISOString()
        })
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    upload(evt) {
      if (this.uploading)
        return
      this.$refs.file.pickFiles(evt)
    },
    doUpload() {
      if (this.uploading || this.file == null)
        return
      this.uploading = true
      this.objectsApi.putObjectData(this.objectId, this.file, undefined, this.client_.cid, true, {
        headers: {
          "Content-Type": this.file.type
        }
      })
        .then(() => {
          this.loadObject()
          this.file = null
        })
        .catch(this.$throw)
        .finally(() => this.uploading = false)
    },
    download() {
      if (this.downloading)
        return
      this.downloading = true
      let d = this.$q.dialog({
        title: this.$appt('download'),
        persistent: true,
        progress: true,
        ok: false
      })
      this.objectsApi.getObjectData(this.objectId, this.client_.cid, true, {
        onDownloadProgress: a => d.update({message: parseInt(100 * a.loaded / a.total) + "%"}),
        responseType: 'blob',
        responseText: undefined
      })
        .then(res => {
          let type = res.headers['content-type'] || this.object.type
          let blob = res.data

          let a = document.createElement('a')
          a.download = this.object.id
          a.href = URL.createObjectURL(blob)
          a.click()
        })
        .catch(this.$throw)
        .finally(() => {
          this.downloading = false
          d.hide()
        })
    },
    deleteObject() {
      if (this.deleting)
        return
      this.$q.dialog({
        title: this.$appt("deleteTitle"),
        message: this.$appt("deleteMessage", this.object),
        cancel: {
          color: 'grey',
          flat: true
        },
        ok: {
          label: this.$appt('delete'),
          color: 'negative',
          flat: true
        }
      }).onOk(() => {
        if (this.deleting)
          return
        this.deleting = true
        this.objectsApi.deleteObject(this.objectId, this.client_.cid, true)
          .then(res => {
            this.$router.push({
              name: this.$options.app + '/objects'
            })
          })
          .catch(this.$throw)
          .finally(() => this.deleting = false)
      })
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
