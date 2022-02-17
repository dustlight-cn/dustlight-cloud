<template>
  <client-required-adaptive-layout
    :title="$appt('menu.objects')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <q-list separator v-if="loading">
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
    <q-list style="text-overflow: ellipsis" separator v-else-if="objects && objects.data.length > 0">
      <q-item v-for="(obj,index) in objects.data" :key="obj" clickable v-ripple>
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

    <q-page-sticky :offset="[18,18]">
      <q-btn :loading="creating" @click="newObject" color="primary" round icon="add"/>
    </q-page-sticky>
  </client-required-adaptive-layout>
</template>

<script>
import ChannelList from "../../messenger/components/ChannelList";
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
import NoResults from "../../../components/common/NoResults";

export default {
  name: "Objects",
  components: {NoResults, ChannelList, ClientRequiredAdaptiveLayout},
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
      this.page = this.$route.query.page || 1
      this.loadObjects()
    },
    client_() {
      this.page = this.$route.query.page || 1
      this.loadObjects()
    },
    user_() {
      this.page = this.$route.query.page || 1
      this.loadObjects()
    }
  },
  methods: {
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

    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
