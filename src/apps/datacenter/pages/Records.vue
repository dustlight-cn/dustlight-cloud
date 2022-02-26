<template>
  <client-required-adaptive-layout
    :title="$appt('menu.records')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <div class="q-gutter-sm">
      <q-input autofocus ref="formName" v-model="formName" :rules="formNameRule" filled :debounce="500"
               :label="$appt('formName')"
               dense>
        <template v-slot:prepend>
          <q-icon name="list_alt"/>
        </template>
        <template v-slot:after>
          <q-btn icon="search" flat round dense @click="selectForm"/>
        </template>
      </q-input>
      <q-tabs
        v-model="searchMode"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        no-caps
      >
        <q-tab name="simple" :label="$appt('simpleSearch')"/>
        <q-tab name="advanced" :label="$appt('advancedSearch')"/>
      </q-tabs>
      <q-tab-panels v-model="searchMode" animated>
        <q-tab-panel name="simple">
          <q-input style="max-width: 600px;margin: 0 auto" v-model="simpleQuery"
                   filled
                   @keydown.enter="simpleSearch"
                   clearable dense>
            <template v-slot:prepend>
              <q-icon name="search"/>
            </template>
            <template v-slot:after>
              <q-btn :disable="!form" :loading="loading" color="primary" :label="$q.lang.label.search"
                     @click="simpleSearch"/>
            </template>
          </q-input>
        </q-tab-panel>

        <q-tab-panel name="advanced">
          -
        </q-tab-panel>

      </q-tab-panels>
    </div>

    <RecordTable @request="onRequest" :records="records" :form="form" :loading="loading"/>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
import FormSelector from "../components/FormSelector";
import RecordTable from "../components/RecordTable";

export default {
  name: "Records",
  components: {RecordTable, ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,

      formName: "",
      form: null,
      formNameRule: [
        val => val && val.trim().length > 0 || this.$appt('notEmpty'),
        val => {
          if (this.form && val.trim() == this.form.name)
            return true
          return this.formsApi.getLatestForm(val.trim(), this.client_.cid)
            .then(res => {
              this.form = res.data
              return true
            })
            .catch(e => {
              if (e && e.response && e.response.status == 404) {
                this.form = null
                return this.$appt('formNotFound')
              }
              return e.message || e
            })
        }
      ],
      records: null,
      orders: [],
      searchMode: "simple",
      simpleQuery: "",
      loading: false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 1,
        rowsNumber: 0
      }
    }
  },
  watch: {
    form() {
      this.records = null
    },
    formName() {
      let obj = this.cloneQuery()
      obj.form = this.formName
      this.$router.push({name: this.$route.name, query: obj})
    },
    "$route.query"() {
      this.formName = this.$route.query.form || ""
      // this.$refs.formName.validate()
    }
  },
  computed: {
    /**
     *
     * @returns {FormsApi}
     */
    formsApi() {
      return this.$options.ext.formsApi(this.token_.access_token)
    },
    /**
     *
     * @returns {RecordsApi}
     */
    recordsApi() {
      return this.$options.ext.recordsApi(this.token_.access_token)
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
    selectForm() {
      this.$q.dialog({
        component: FormSelector,
        componentProps: {
          icon: "list_alt",
          title: this.$appt("selectForm"),
          formsApi: this.formsApi,
          client: this.client_.cid,
          formName: this.formName
        }
      })
        .onOk((form) => {
          this.form = form
          this.formName = form.name
        })
    },
    onRequest(props) {
      if (this.searchMode = "simple") {
        this.pagination.page = props.pagination.page
        this.pagination.rowsPerPage = props.pagination.rowsPerPage
        this.simpleSearch()
      }
      console.log(props)
    },
    simpleSearch() {
      if (this.loading)
        return
      this.loading = true
      this.recordsApi.findRecords(this.formName,
        this.simpleQuery || "",
        this.orders,
        this.pagination.page - 1,
        this.pagination.rowsPerPage,
        this.client_.cid, [])
        .then(res => {
          this.records = res.data
          this.pagination.rowsNumber = res.data.count
        })
        .catch(this.$throw)
        .finally(() => this.loading = false)
    }
  },
  mounted() {
    this.formName = this.$route.query.form
  }
}
</script>

<style scoped>

</style>
