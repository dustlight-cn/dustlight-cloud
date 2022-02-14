<template>
  <div>
    <div class="q-mb-sm">
      <div style="max-width: 600px;margin: 0 auto">
        <q-input dense v-model="key" filled :placeholder="$q.lang.label.search" :debounce="500" :loading="loading"
                 clearable>
          <template v-slot:prepend>
            <q-icon name="search"/>
          </template>
        </q-input>
      </div>
    </div>
    <div v-if="loading">
      <q-list bordered separator>
        <q-item v-for="i in size">
          <q-item-section avatar>
            <q-icon name="router"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" width="2em"/>
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" width="3em"/>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-skeleton type="QAvatar" size="1em"/>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div v-else>
      <q-list bordered separator v-if="channels && channels.data" style="word-break: break-all">
        <q-item v-for="(channel,index) in channels.data" :key="index" v-ripple clickable
                @click="$emit('onSelect',channel)"
                :to="to?to(channel):null">
          <q-item-section avatar>
            <q-icon name="router"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ channel.name }}
            </q-item-label>
            <q-item-label caption>
              {{ channel.description }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>
              {{ $moment(channel.updatedAt) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"/>
          </q-item-section>
        </q-item>
      </q-list>
      <div v-if="channels && channels.count > size " class="flex flex-center">
        <q-pagination
          v-model="page"
          :max="Math.ceil(channels.count/size)"
          input
          color="primary"
        />
      </div>
      <div v-if="channels == null || channels.count == 0" class="text-center q-ma-md text-grey">
        {{ $q.lang.table.noData }}
      </div>
    </div>
  </div>
</template>

<script>
import ext from '../ext'

export default {
  name: "ChannelList",
  props: {
    token: Object,
    client: Object,
    to: Function,
    size: {
      type: Number,
      default() {
        return 10
      }
    },
    pushRouteWithPage: Boolean
  },
  emits: ["onSelect"],
  data() {
    return {
      channels: null,
      loading: false,
      page: this.pushRouteWithPage ? (this.$route.query.page || 1) : 1,
      key: ""
    }
  },
  computed: {
    /**
     *
     * @returns {ChannelsApi}
     */
    templatesApi() {
      return ext.channelsApi(this.token.access_token)
    }
  },
  watch: {
    token() {
      this.page = 1
      this.getChannels()
    },
    client() {
      this.page = 1
      this.getChannels()
    },
    key() {
      this.page = 1
      this.getChannels()
    },
    type() {
      this.page = 1
      this.getChannels()
    },
    page() {
      if (this.pushRouteWithPage) {
        let obj = this.cloneQuery()
        obj.page = this.page
        this.$router.push({
          name: this.$route.name,
          query: obj
        })
      } else {
        this.getChannels()
      }
    },
    "$route.query.page"() {
      if (this.pushRouteWithPage)
        this.getChannels()
    }
  },
  methods: {
    cloneQuery() {
      let obj = {}
      for (let key in this.$route.query) {
        obj[key] = this.$route.query[key]
      }
      return obj
    },
    getChannels() {
      if (this.loading)
        return
      this.loading = true
      this.templatesApi.findChannels(this.key || "", this.page - 1, this.size, this.client.cid)
        .then(res => this.channels = res.data)
        .catch(this.$throw)
        .finally(() => this.loading = false)
    }
  },
  mounted() {
    this.getChannels()
  }
}
</script>

<style scoped>

</style>
