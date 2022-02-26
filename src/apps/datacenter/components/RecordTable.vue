<template>
  <div class="q-pa-md">
    {{ pagination }}
    <q-table
      title="Treats"
      :rows="data"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      @request="onRequest"
      row-key="id"
    />
    <GGBOY/>
  </div>
</template>

<script>
import {Form, QueryResultRecord} from "@dustlight/datacenter-client-axios-js";
import {ref, watch, getCurrentInstance, defineEmits} from 'vue';
import GGBOY from "./GGBOY";


export default {
  name: "RecordTable",
  components: {GGBOY},
  props: {
    records: QueryResultRecord,
    form: Form,
    loading: Boolean,
  },
  emits: ['request'],
  watch: {},
  setup(props) {
    const {proxy} = getCurrentInstance()
    let $moment = proxy.$moment
    let columns = ref(computeColumn(props.form, $moment))
    let pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 1,
      rowsNumber: 0
    })
    let data = ref([])

    function onRequest(props) {
      pagination.value.page = props.pagination.page
      pagination.value.rowsPerPage = props.pagination.rowsPerPage
      proxy.$emit("request", props)
    }

    let w1 = watch(() => props.form, (val) => {
      columns.value = computeColumn(val, $moment)
    })

    let w2 = watch(() => props.records, (val) => {
      if (val) {
        pagination.value.rowsNumber = val.count
      } else {
        pagination.value.rowsNumber = 0
      }

      data.value.splice(0, data.value.length, ...(val ? val.data : []))
    })

    return {
      columns,
      pagination,
      data,
      w1,
      w2,
      onRequest
    }
  }
}

/**
 *
 * @param {Form} form
 */
function computeColumn(form, $moment) {
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

</script>
