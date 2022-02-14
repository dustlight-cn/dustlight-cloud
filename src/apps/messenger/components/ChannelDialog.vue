<template>
  <q-dialog ref="dialog">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-subtitle1">
        <q-icon name="router"/>
        {{ $q.lang.label.select }}
      </q-card-section>
      <q-card-section>
        <channel-list :size="5" :token="token" :client="client" @onSelect="onSelect"/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" flat :label="$q.lang.label.ok" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import ChannelList from "./ChannelList";

export default {
  name: "ChannelDialog",
  components: {ChannelList},
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
    onSelect(channel) {
      this.$emit('ok', channel)
      this.hide()
    }
  }
}
</script>

<style scoped>

</style>
