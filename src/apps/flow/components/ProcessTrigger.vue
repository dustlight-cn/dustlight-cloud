<template>
  <q-dialog ref="dialog">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-subtitle1">
        <q-icon name="cable"/>
        {{ title }}
      </q-card-section>
      <q-card-section>
        <q-select :label="eventLabel || 'event'" filled :loading="loading" v-model="opt"
                  :options="options"
                  @filter="loadOperation"/>

        <q-separator class="q-mt-sm q-mb-sm"/>
        <div v-if="triggers && triggers.length > 0">
          <q-chip v-for="(key,index) in triggers" icon="cable" :label="key" :key="index" clickable
                  @click="()=>toTrigger(key)"/>
        </div>
        <div v-else class="text-center text-caption text-grey">
          {{ $q.lang.table.noData }}
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat color="primary" :label="$q.lang.label.close" @click="hide"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "ProcessTrigger",
  props: {
    title: String,
    eventLabel: String,
    getKeys: {
      type: Function,
      default() {
        return null
      }
    },
    getOptions: {
      type: Function,
      default() {
        return null
      }
    },
    gotoTrigger: {
      type: Function,
      default() {
        return null
      }
    },
  },
  data() {
    return {
      triggers: [],
      options: null,
      opt: "",
      loading: false
    }
  },
  watch: {
    opt() {
      this.load()
    }
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    load() {
      if (this.loading)
        return
      this.loading = true
      this.getKeys(this.opt)
        .then(res => this.triggers = res.data)
        .finally(() => this.loading = false)
    },
    loadOperation(val, update, abort) {
      if (this.options) {
        update()
        return
      }
      this.getOptions()
        .then(res => this.options = res.data)
        .finally(() => update())
    },
    toTrigger(key) {
      this.gotoTrigger(key, this.opt)
    }
  },
  mounted() {
    this.load()
  }
}
</script>

<style scoped>

</style>
