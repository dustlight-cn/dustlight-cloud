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
      <q-list separator>
        <q-item v-for="i in size">
          <q-item-section avatar>
            <q-icon name="wysiwyg"/>
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
      <q-list separator v-if="templates && templates.data" style="word-break: break-all">
        <q-item v-for="(template,index) in templates.data" :key="index" v-ripple clickable
                @click="$emit('onSelect',template)"
                :to="to?to(template):null">
          <q-item-section avatar>
            <q-icon name="wysiwyg"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ template.name }}
            </q-item-label>
            <q-item-label caption>
              {{ template.id }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"/>
          </q-item-section>
        </q-item>
      </q-list>
      <div v-if="templates && templates.count > size " class="flex flex-center">
        <q-pagination
          v-model="page"
          :max="Math.ceil(templates.count/size)"
          input
          color="primary"
        />
      </div>
      <div v-if="templates == null || templates.count == 0" class="text-center q-ma-md text-grey">
        {{ $q.lang.table.noData }}
      </div>
    </div>
  </div>
</template>

<script>
import ext from '../ext'

export default {
  name: "TemplateList",
  props: {
    token: Object,
    client: Object,
    to: Function
  },
  emits: ["onSelect"],
  data() {
    return {
      templates: null,
      loading: false,
      page: this.$route.query.page || 1,
      size: 10,
      type: "EMAIL",
      key: ""
    }
  },
  computed: {
    /**
     *
     * @returns {TemplatesApi}
     */
    templatesApi() {
      return ext.templatesApi(this.token.access_token)
    }
  },
  watch: {
    token() {
      this.page = 1
      this.getTemplates()
    },
    client() {
      this.page = 1
      this.getTemplates()
    },
    key() {
      this.page = 1
      this.getTemplates()
    },
    type() {
      this.page = 1
      this.getTemplates()
    },
    page() {
      let obj = this.cloneQuery()
      obj.page = this.page
      this.$router.push({
        name: this.$route.name,
        query: obj
      })
    },
    "$route.query.page"() {
      this.getTemplates()
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
    getTemplates() {
      if (this.loading)
        return
      this.loading = true
      this.templatesApi.findTemplates(this.key || "", this.page - 1, this.size, this.type, this.client.cid)
        .then(res => this.templates = res.data)
        .catch(this.$throw)
        .finally(() => this.loading = false)
    }
  },
  mounted() {
    this.getTemplates()
  }
}
</script>

<style scoped>

</style>
