<template>
  <q-dialog :persistent="saving" ref="dialog">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-subtitle1">
        <q-icon name="edit"/>
        {{ varName }}
      </q-card-section>
      <q-card-section class="scroll">
        <q-input :readonly="readonly" :rules="rule" :disable="saving" type="textarea" v-model="model" filled/>
      </q-card-section>
      <q-card-actions v-if="readonly" align="right">
        <q-btn color="primary" :label="$q.lang.label.ok" v-close-popup/>
      </q-card-actions>
      <q-card-actions v-else align="right">
        <q-btn :disable="saving" flat :label="$q.lang.label.cancel" @click="onCancelClick"/>
        <q-btn :loading="saving" color="primary" :label="$q.lang.label.set" @click="onSave"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "EditVariable",
  props: {
    varName: {
      type: String,
      default() {
        return ""
      }
    },
    varVal: {
      type: String,
      default() {
        return ""
      }
    },
    api: {
      type: Function,
      default() {
        return null
      }
    },
    readonly: Boolean
  },
  data() {
    return {
      model: "",
      saving: false,
      rule: [
        val => {
          try {
            JSON.parse(val)
          } catch (e) {
            return e.message || e
          }
          return true
        }
      ]
    }
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    onSave() {
      if (this.saving)
        return
      this.saving = true
      if (this.api == null) {
        this.$emit('ok', this.model)
        this.hide()
      } else {
        this.api(this.model)
          .then(() => {
            this.$emit('ok', this.model)
            this.hide()
          })
          .catch(this.$throw)
          .finally(() => this.saving = false)
      }
    },
    onCancelClick() {
      this.hide()
    }
  },
  mounted() {
    this.model = this.varVal
  }
}
</script>

<style scoped>

</style>
