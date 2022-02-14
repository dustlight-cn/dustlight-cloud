<template>
  <q-dialog ref="dialog">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-subtitle1">
        <q-icon name="wysiwyg"/>
        {{ $q.lang.label.select }}
      </q-card-section>
      <q-card-section>
        <template-list :size="5" :token="token" :client="client" @onSelect="onSelect"/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" flat :label="$q.lang.label.ok" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import TemplateList from "./TemplateList";

export default {
  name: "TemplateDialog",
  components: {TemplateList},
  props: {
    token: Object,
    client: Object
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    onSelect(template) {
      this.$emit('ok', template)
      this.hide()
    }
  }
}
</script>

<style scoped>

</style>
