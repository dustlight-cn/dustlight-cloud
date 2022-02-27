<template>
  <q-table
    flat
    bordered
    color="primary"
    :rows="data"
    :columns="columns"
    :visible-columns="visible"
    v-model:pagination="pagination"
    :rows-per-page-options="[5,10,20,50,100]"
    :loading="loading"
    @request="onRequest"
    row-key="id"
  >
    <template v-slot:top="props">
      <slot/>
      <q-space/>
      <q-btn v-if="columns" round flat icon="visibility">
        <q-menu>
          <q-card>
            <q-list>
              <q-item dense v-ripple v-for="(col,index) in columns" :key="index" tag="label">
                <q-item-section>
                  <q-item-label>
                    {{ col.label }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle :disable="col.required" color="primary" :val="col.name" v-model="visible"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-menu>
      </q-btn>
    </template>
  </q-table>
</template>

<script>
import {Form, QueryResultRecord} from "@dustlight/datacenter-client-axios-js";
import {ref, watch, getCurrentInstance} from 'vue';


export default {
  name: "RecordTable",
  components: {},
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
      sortBy: null,
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    })
    let data = ref([])
    let visible = ref([...getColumVisible(columns.value)])

    function onRequest(props) {
      pagination.value.sortBy = props.pagination.sortBy
      pagination.value.descending = props.pagination.descending
      pagination.value.page = props.pagination.page
      pagination.value.rowsPerPage = props.pagination.rowsPerPage
      proxy.$emit("request", props)
    }

    let w1 = watch(() => props.form, (val) => {
      columns.value = computeColumn(val, $moment)
      visible.value = getColumVisible(columns.value)
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
      visible,
      w1,
      w2,
      onRequest
    }
  }
}

function getColumVisible(column) {
  if (!column || column.length == 0)
    return []
  let arr = []
  column.forEach(val => {
    arr.push(val.name)
  })
  return arr;
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
    sortable: false
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
        required: false,
        label: labelPrefix,
        align: 'center',
        field: row => getPathData(row.data, path),
        format: val => format(node, val),
        sortable: ['number', 'integer'].includes(node.type) || node.type == 'string' && ['data', 'time', 'date-time'].includes(node.format)
      }]
    }

    let children = computeSchema(form.schema, [], "data", "")
    result.push(...children)
  }

  result.push({
    name: 'formVersion',
    required: false,
    label: 'Version',
    align: 'center',
    field: "formVersion",
    sortable: true
  })
  result.push({
    name: 'createdAt',
    required: false,
    label: 'CreatedAt',
    align: 'center',
    field: "createdAt",
    format: val => $moment(val),
    sortable: true
  })
  result.push({
    name: 'updatedAt',
    required: false,
    label: 'UpdatedAt',
    align: 'center',
    field: "updatedAt",
    format: val => $moment(val),
    sortable: true
  })
  return result
}

</script>
