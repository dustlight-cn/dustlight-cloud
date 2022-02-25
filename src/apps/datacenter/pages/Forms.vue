<template>
  <client-required-adaptive-layout
    :title="$appt('menu.forms')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}
    <div class="q-mb-sm">
      <q-input style="max-width: 600px;margin: 0 auto" dense :loading="loading" v-model="query" filled
               :placeholder="$q.lang.label.search" :debounce="500" clearable>
        <template v-slot:prepend>
          <q-icon name="search"/>
        </template>
      </q-input>
    </div>
    <div v-if="loading">
      <q-list bordered separator>
        <q-item v-for="i in size">
          <q-item-section avatar>
            <q-icon name="list_alt"/>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>
              <q-skeleton type="text" width="2em"/>
            </q-item-label>
            <q-item-label>
              <q-skeleton type="text" width="2em"/>
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" width="4em"/>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-skeleton type="text" width="2em"/>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div v-else>
      <q-list bordered separator v-if="forms && forms.data && forms.data.length > 0">
        <q-item v-for="(form,index) in forms.data" clickable v-ripple
                :to="{name: $options.app + '/form',params:{ id: form.id }}">
          <q-item-section avatar>
            <q-icon name="list_alt"/>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>
              {{ form.name }}
              <q-badge>v{{ form.version }}</q-badge>
            </q-item-label>
            <q-item-label>
              {{ form.schema.title }}
            </q-item-label>
            <q-item-label caption>
              {{ form.schema.description }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"/>
          </q-item-section>
        </q-item>
      </q-list>
      <no-results v-else/>
      <div v-if="forms && forms.count > size " class="flex flex-center">
        <q-pagination
          v-model="page"
          :max="Math.ceil(forms.count/size)"
          input
          color="primary"
        />
      </div>
    </div>
    <q-page-sticky :offset="[18,18]">
      <q-btn :to="{name: $options.app + '/new-form'}" color="primary" round icon="add"/>
    </q-page-sticky>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
import NoResults from "../../../components/common/NoResults";
export default {
  name: "Forms",
  components: {NoResults, ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,

      forms: null,
      loading: false,
      query: this.$route.query.key || "",
      size: 10,
      page: this.$route.query.page || 1
    }
  },
  computed: {
    /**
     *
     * @returns {FormsApi}
     */
    formsApi() {
      return this.$options.ext.formsApi(this.token_.access_token)
    }
  },
  watch: {
    client_() {
      this.loadForms()
    },
    user_() {
      this.loadForms()
    },
    token_() {
      this.loadForms()
    },
    query() {
      let obj = this.cloneQuery()
      if (this.query)
        obj.key = this.query
      else
        delete obj['key']
      delete obj['page']
      this.$router.push({name: this.$route.name, query: obj})
    },
    page() {
      let obj = this.cloneQuery()
      obj.page = this.page
      this.$router.push({name: this.$route.name, query: obj})
    },
    "$route.query"() {
      this.page = this.$route.query.page || 1
      this.key = this.$route.query.key || ""
      this.loadForms()
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
    loadForms() {
      if (this.loading)
        return
      this.loading = true
      this.formsApi.getForms(undefined, this.query || "", this.page - 1, this.size, this.client_.cid)
        .then((res) => this.forms = res.data)
        .catch(this.$throw)
        .finally(() => this.loading = false)

    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
