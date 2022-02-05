<template>
  <q-dialog :persistent="creating" ref="dialog">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-subtitle1">
        <q-icon name="play_arrow"/>
        {{ title }}
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2">{{ variablesLabel }}</div>
        <q-list dense separator>
          <q-item v-for="(val,key) in variables" :key="key">
            <q-item-section>
              <q-item-label overline>{{ key }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ val }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn dense flat round icon="remove" @click="()=>remove(key)"/>
            </q-item-section>
          </q-item>
          <q-separator/>
          <q-form @submit="add">
            <q-item>
              <q-item-section>
                <q-input :rules="rules" :label="nameLabel" dense filled v-model="model.key"/>
              </q-item-section>
              <q-item-section>
                <q-input :rules="rules" :label="valueLabel" dense filled v-model="model.value"/>
              </q-item-section>
              <q-item-section side>
                <q-btn type="submit" dense flat round icon="add"/>
              </q-item-section>
            </q-item>
          </q-form>
        </q-list>
        <!--        <q-input :disable="saving" type="textarea" v-model="model" filled/>-->
      </q-card-section>
      <q-card-actions align="right">
        <q-btn :disable="creating" flat :label="$q.lang.label.cancel" @click="onCancelClick"/>
        <q-btn :loading="creating" color="primary" :label="$q.lang.label.ok" @click="onSave"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "RunProcess",
  props: {
    title: String,
    variablesLabel: String,
    nameLabel: String,
    valueLabel: String,
    rules: Array,
    api: {
      type: Function,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      variables: {},
      model: {
        key: "",
        value: ""
      },
      creating: false
    }
  },
  methods: {
    buildMap(obj) {
      let json = '{'
      let flag = false
      for (let key in obj) {
        if (flag)
          json += ','
        flag = true
        let val = obj[key].trim() == "" ? "null" : obj[key].trim()
        json += `"${key}":${val}`
      }
      json += '}'
      return json
    },
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    onSave() {
      if (this.creating)
        return
      this.creating = true
      let vars = this.buildMap(this.variables)
      if (this.api == null) {
        this.$emit('ok', vars)
        this.hide()
      } else {
        this.api(vars)
          .then(() => {
            this.$emit('ok', vars)
            this.hide()
          })
          .catch(this.$throw)
          .finally(() => this.creating = false)
      }
    },
    onCancelClick() {
      this.hide()
    },
    add() {
      this.variables[this.model.key] = this.model.value
      this.model.key = ""
      this.model.value = ""
    },
    remove(key) {
      delete this.variables[key]
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
