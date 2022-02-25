<template>
  <q-dialog ref="dialog">
    <q-card class="q-dialog-plugin full-width">
      <q-card-section class="text-subtitle1">
        <q-icon v-if="icon" :name="icon"/>
        {{ title }}
      </q-card-section>
      <q-card-section>
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
                    @click="()=>onSelect(form)">
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
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import {FormsApi} from "@dustlight/datacenter-client-axios-js";
import NoResults from "../../../components/common/NoResults";

export default {
  name: "FormSelector",
  components: {NoResults},
  props: {
    title: String,
    icon: String,
    formsApi: FormsApi,
    client: String,
    formName: String
  },
  data() {
    return {
      loading: null,
      forms: null,
      page: 1,
      size: 5,
      query: ""
    }
  },
  watch: {
    query() {
      this.page = 1
      this.loadForms()
    },
    page() {
      this.loadForms()
    }
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    onSelect(form) {
      this.$emit('ok', form)
      this.hide()
    },
    loadForms() {
      if (this.loading)
        return
      this.loading = true
      this.formsApi.getForms(undefined, this.query || "", this.page - 1, this.size, this.client)
        .then((res) => this.forms = res.data)
        .catch(this.$throw)
        .finally(() => this.loading = false)

    }
  },
  mounted() {
    this.query = this.formName
    this.loadForms()
  }
}
</script>

<style scoped>

</style>
