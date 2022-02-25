<template>
  <client-required-adaptive-layout
    :title="$appt('menu.forms')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <div class="q-mb-sm">
      <div class="text-subtitle2">
        <q-btn v-if="formId" flat icon="list_alt" no-caps>
          <span v-if="form">
            {{ form.name }}
            <q-badge>v{{ form.version }}</q-badge>
          </span>
          <span v-else>{{ formId }}</span>
        </q-btn>
        <div v-else>
          <q-icon name="list_alt"/>
          {{ $appt('newForm') }}
        </div>
      </div>
    </div>
    <q-card flat class="q-pa-xs" v-if="form" style="height: calc(50%)">

      <q-input :loading="loading" :label="$appt('formName')" :debounce="500" :rules="formNameRules" v-if="!formId"
               filled
               v-model.trim="form.name"/>
      <json-form-editor
        ref="editor"
        :name="form.name"
        :schema="form.schema"
        :ui-schema="form.additional.uiSchema" :meta-schema="null">

        <div class="q-pa-sm text-right">
          <q-btn :loading="loading" @click="save" :label="$appt('save')" color="primary"/>
        </div>
      </json-form-editor>
    </q-card>
    <div v-else class="text-center">
      <q-spinner-gears color="primary" size="5em"/>
    </div>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
import {reactive} from 'vue'

function adapt(obj) {
  if (!obj || typeof obj != 'object')
    return {}
  let result = {}
  result["$schema"] = obj["$schema"]
  result["$id"] = obj["$id"]
  delete obj["$schema"]
  delete obj["$id"]
  return result
}

function revert(obj, target) {
  if (!obj || !target)
    return obj
  for (let k in target) {
    obj[k] = target[k]
  }
  return obj
}

export default {
  name: "Forms",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,

      loading: false,
      formId: this.$route.params.id,
      form: null,
      schemaIgnore: {},
      formNameRules: [
        val => val && val.trim().length > 0 || this.$appt('notEmpty'),
        val => this.formsApi.getLatestForm(val.trim(), this.client_.cid)
          .then(res => this.$appt('formNameExists'))
          .catch(e => {
            if (e.response && e.response.status == 404)
              return true
            return e.message
          })
      ]
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
      this.loadForm()
    },
    user_() {
      this.loadForm()
    },
    token_() {
      this.loadForm()
    }
  },
  methods: {
    loadForm() {
      if (this.form != null)
        return;
      if (!this.formId) {
        this.schemaIgnore = {
          "$id": this.$options.ext.basePath + '/v1/schemas/',
          "$schema": this.$options.ext.basePath + '/v1/schemas/form'
        }
        this.form = {
          name: "form_" + new Date().getTime().toString(32),
          schema: {
            type: "object",
            title: "",
            description: "",
            additionalProperties: false
          },
          additional: {
            uiSchema: {}
          }
        }
        return;
      }
      if (this.loading)
        return
      this.loading = true
      this.formsApi.getFormById(this.formId, this.client_.cid)
        .then((res) => {
          this.form = res.data
          if (!this.form.additional)
            this.form.additional = {}
          if (!this.form.additional.uiSchema)
            this.form.additional.uiSchema = {}
          this.schemaIgnore = adapt(this.form.schema)
        })
        .catch(this.$throw)
        .finally(() => this.loading = false)

    },
    save() {
      if (this.loading)
        return
      this.form.schema = this.$refs.editor.getSchema()
      this.form.additional.uiSchema = this.$refs.editor.getUiSchema()

      this.loading = true
      let p = null;
      revert(this.form.schema, this.schemaIgnore)
      if (this.formId) {
        p = this.formsApi.updateForm(this.form, this.client_.cid)
      } else {
        p = this.formsApi.createForm(this.form, this.client_.cid)
      }
      p.then(res => {
        this.form = res.data
        this.formId = res.data.id
      })
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
