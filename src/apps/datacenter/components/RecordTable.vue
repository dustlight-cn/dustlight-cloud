<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :rows="data"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script>
import {Form} from "@dustlight/datacenter-client-axios-js";
import {reactive, watch, getCurrentInstance} from 'vue';

const columns = [
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: row => row.id,
    format: val => `${val}`,
    sortable: true
  },
  {name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true},
  {name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true},
  {name: 'carbs', label: 'Carbs (g)', field: 'carbs'},
  {name: 'protein', label: 'Protein (g)', field: 'protein'},
  {name: 'sodium', label: 'Sodium (mg)', field: 'sodium'},
  {
    name: 'calcium',
    label: 'Calcium (%)',
    field: 'calcium',
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
  },
  {name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)}
]


export default {
  name: "RecordTable",
  props: {
    data: Array,
    form: Form
  },
  setup(props) {
    let $moment = getCurrentInstance().appContext.config.globalProperties.$moment

    /**
     *
     * @param {Form} form
     */
    function computeColumn(form) {
      let result = []
      result.push({
        name: 'id',
        required: true,
        label: 'ID',
        align: 'center',
        field: "id",
        sortable: true
      })
      result.push({
        name: 'formVersion',
        required: true,
        label: 'Version',
        align: 'center',
        field: "formVersion",
        sortable: true
      })
      if (form) {
        function getPathData(root, path) {
          let iter = root
          if (path) {
            for (let i in path) {
              let key = path[i]
              if (iter == null)
                return iter
              iter = iter[key]
            }
          }
          return iter
        }

        function format(schema, val) {
          if (val == null || val == undefined)
            return "-"
          return val
        }

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
            name: namePrefix,
            required: true,
            label: labelPrefix,
            align: 'center',
            field: row => getPathData(row.data, path),
            format: val => format(node, val),
            sortable: true
          }]
        }

        let children = computeSchema(form.schema, [], "", "")
        result.push(...children)
      }
      result.push({
        name: 'createdAt',
        required: true,
        label: 'CreatedAt',
        align: 'center',
        field: "createdAt",
        format: val => $moment(val),
        sortable: true
      })
      result.push({
        name: 'updatedAt',
        required: true,
        label: 'UpdatedAt',
        align: 'center',
        field: "updatedAt",
        format: val => $moment(val),
        sortable: true
      })
      return result
    }

    let columns = reactive(computeColumn(props.form))
    let w = watch(props.form, () => {
      columns = reactive(computeColumn(props.form))
    })

    return {
      columns
    }
  }
}
</script>
