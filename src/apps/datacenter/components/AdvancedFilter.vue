<template>
  <q-list separator>
    <q-item v-for="(filter,index) in modelValue" dense>

      <q-item-section class="q-gutter-xs">
        <q-select label="Field"
                  dense filled
                  v-model="modelValue[index].name"
                  map-options
                  :options="fieldOptions"
                  emit-value/>

        <q-select label="Opt" dense v-model="modelValue[index].opt" :options="optOptions" emit-value/>

        <q-input :debounce="500" dense outlined
                 v-model="modelValue[index].value" label="Value" :rules="jsonRules"/>
      </q-item-section>
      <q-item-section side>
        <q-btn dense icon="remove" round flat @click="()=>modelValue.splice(index,1)"/>
      </q-item-section>
    </q-item>
    <div class="text-center">
      <q-btn dense icon="add" round flat @click="add"/>
    </div>
  </q-list>
</template>

<script>
import {Form} from "@dustlight/datacenter-client-axios-js";

function computeSchema(node, path, namePrefix, labelPrefix) {
  if (!node)
    return null
  if (node.type == 'object') {
    let children = []
    for (let i in node.properties) {
      let newPath = [...path, i]
      let label = node.properties[i].title
      if (label)
        label = label.trim()
      if (!label)
        label = i
      let c = computeSchema(node.properties[i],
        newPath,
        namePrefix ? (namePrefix + "." + i) : i,
        labelPrefix ? (labelPrefix + "." + label) : label)
      children.push(...c)
    }
    return children
  }
  return [{
    value: namePrefix,
    label: labelPrefix
  }]
}

export default {
  name: "AdvancedFilter",
  props: {
    modelValue: Array,
    form: Form
  },
  data() {
    return {
      optOptions: ["EQUAL", "IN", "BETWEEN", "MATCH"],
      jsonRules: [
        val => {
          try {
            JSON.parse(val)
            return true
          } catch (e) {
            return e.message || e
          }
        }
      ]
    }
  },
  computed: {
    fieldOptions() {
      if (this.form && this.form.schema) {
        return computeSchema(this.form.schema, [], "data", "")
      }
      return []
    }
  },
  methods: {
    add() {
      if (!this.modelValue)
        this.modelValue = []
      this.modelValue.push({
        name: "",
        opt: "",
        value: null
      })
    }
  }
}
</script>

<style scoped>

</style>
