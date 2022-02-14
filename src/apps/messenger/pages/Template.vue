<template>
  <client-required-adaptive-layout
    :title="$appt('menu.templates')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <div class="text-subtitle1 q-mb-md">
      <q-icon name="wysiwyg" size="2em"/>
      <span class="text-caption ">{{ templateId }}</span>
    </div>
    <q-form @submit="save" class="q-gutter-sm">
      <q-input :rules="rules" :loading="loading" filled :label="$appt('templateName')" v-model="template.name"/>
      <q-editor :toolbar="toolbarOptions" ref="editor" :disable="loading" v-model="template.content"/>
      <div class="text-right">
        <q-btn class="text-capitalize" type="submit" color="primary" :loading="loading" :label="$q.lang.label.update"
               no-caps/>
      </div>
    </q-form>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
export default {
  name: "Template",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,
      loading: false,
      template: {
        name: "",
        content: ""
      },
      templateId: this.$route.params.id,
      type: this.$route.query.type || "EMAIL",
      rules: [
        val => val && val.trim().length > 0 || this.$appt("notEmpty")
      ],
      toolbarOptions: [["left", "center", "right", "justify"],
        ["bold", "italic", "underline", "strike"],
        ['token', 'hr', 'link', 'custom_btn'],
        [
          {
            label: this.$q.lang.editor.formatting,
            icon: this.$q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
          },
          {
            label: this.$q.lang.editor.fontSize,
            icon: this.$q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ["undo", "redo"],
        ['fullscreen', 'viewsource']
      ]
    }
  },
  watch: {
    token_() {
      this.loadTemplate()
    },
    client_() {
      this.loadTemplate()
    }
  },
  computed: {
    /**
     *
     * @returns {TemplatesApi}
     */
    templatesApi() {
      return this.$options.ext.templatesApi(this.token_.access_token)
    }
  },
  methods: {
    loadTemplate() {
      if (this.loading)
        return

      this.loading = true
      this.templatesApi.getTemplate(this.templateId, this.type, this.client_.cid)
        .then(res => this.template = res.data)
        .catch(this.$throw)
        .finally(() => this.loading = false)
    },
    save() {
      if (this.loading)
        return
      this.loading = true
      this.templatesApi.updateTemplate(this.templateId, {
        name: this.template.name,
        content: this.template.content
      }, this.type, this.client_.cid)
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
