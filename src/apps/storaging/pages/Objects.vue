<template>
  <client-required-adaptive-layout
    :title="$appt('menu.objects')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <div class="q-mb-md">
      <q-input dense style="max-width: 600px;margin: 0 auto"
               :loading="loading"
               filled v-model="key" :debounce="500" :placeholder="$q.lang.label.search" clearable>
        <template v-slot:prepend>
          <q-icon name="search"/>
        </template>
      </q-input>
    </div>

    <q-list bordered separator v-if="loading">
      <q-item v-for="i in size" :key="i">
        <q-item-section avatar>
          <q-icon name="text_snippet"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" width="2em"/>
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" width="3em"/>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-list bordered style="text-overflow: ellipsis" separator v-else-if="objects && objects.data.length > 0">
      <q-item v-for="(obj,index) in objects.data" :key="obj" clickable v-ripple
              :to="{name: $options.app + '/object',params:{id:obj.id }}">
        <q-item-section avatar>
          <q-icon name="text_snippet"/>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">
            {{ obj.name }}
          </q-item-label>
          <q-item-label caption lines="1">
            {{ obj.description }}
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label caption :lines="1">
            <q-badge :label="obj.type || '-'"/>
          </q-item-label>
          <q-item-label lines="1" caption>
            {{ $moment(obj.updatedAt) }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label lines="1" caption>
            {{ $options.ext.byteString(obj.size) }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right"/>
        </q-item-section>
      </q-item>
    </q-list>
    <no-results v-else/>

    <div v-if="objects && objects.count > size " class="flex flex-center">
      <q-pagination
        v-model="page"
        :max="Math.ceil(objects.count/size)"
        input
        color="primary"
      />
    </div>

    <q-page-sticky :offset="[18,18]">
      <q-btn :loading="creating" @click="newObject" color="primary" round icon="add"/>
    </q-page-sticky>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
import NoResults from "../../../components/common/NoResults";

export default {
  name: "Objects",
  components: {NoResults, ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,
      creating: false,
      objects: null,
      loading: false,
      key: this.$route.query.key || "",
      page: this.$route.query.page || 1,
      size: 10
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
      this.loadObjects()
    },
    client_() {
      this.loadObjects()
    },
    user_() {
      this.loadObjects()
    },
    page() {
      let obj = this.cloneQuery()
      obj.page = this.page
      this.$router.push({name: this.$route.name, query: obj})
    },
    key() {
      let obj = this.cloneQuery()
      obj.key = this.key
      obj.page = 1
      this.$router.push({name: this.$route.name, query: obj})
    },
    "$route.query.page"() {
      if (this.$route.name != this.$options.app + "/objects")
        return
      this.page = this.$route.query.page || 1
      this.key = this.$route.query.key || ""
      this.loadObjects()
    },
    "$route.query.key"() {
      if (this.$route.name != this.$options.app + "/objects")
        return
      this.page = this.$route.query.page || 1
      this.key = this.$route.query.key || ""
      this.loadObjects()
    }
  },
  methods: {
    cloneQuery() {
      let obj = {}
      for (let i in this.$route.query)
        obj[i] = this.$route.query[i]
      return obj;
    },
    loadObjects() {
      if (this.loading)
        return
      this.loading = true
      this.objectsApi.findObjects(this.key, this.page - 1, this.size, this.client_.cid, true)
        .then(res => {
          this.objects = res.data
        })
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    newObject() {
      if (this.creating)
        return
      this.$q.dialog({
        title: this.$appt('newObject'),
        prompt: {
          label: this.$appt('objectName'),
          model: "",
          isValid: val => val && val.trim().length > 0
        },
        cancel: {
          color: 'grey',
          flat: true
        }
      })
        .onOk(name => {
          if (this.creating)
            return
          this.creating = true
          this.objectsApi.createObject({
            name: name.trim(),
            description: ""
          }, this.client_.cid)
            .then(res => this.$router.push({
              name: this.$options.app + '/object',
              params: {
                id: res.data.id
              }
            }))
            .catch(this.$throw)
            .finally(() => this.creating = false)
        })
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
