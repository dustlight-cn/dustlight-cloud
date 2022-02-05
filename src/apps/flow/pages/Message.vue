<template>
  <client-required-adaptive-layout
    :title="$appt('menu.message')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <q-form class="q-gutter-sm" @submit="send">
      <q-input :rules="rules" :disable="sending" filled v-model="model.key" :label="$appt('messageName')"/>
      <q-input :rules="rules" :disable="sending" filled v-model="model.val" :label="$appt('messageKey')"/>
      <div class="text-right q-mt-sm">
        <q-btn no-caps color="primary" :loading="sending" :label="$appt('send')" icon="send" type="submit"/>
      </div>
    </q-form>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "Message",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      user_: null,
      token_: null,
      client_: null,
      model: {
        key: "",
        val: ""
      },
      sending: false,
      rules: [val => val && val.trim().length > 0 || this.$appt('notEmpty')]
    }
  },
  computed: {
    /**
     *
     * @returns {MessagesApi}
     */
    messagesApi() {
      return this.$options.ext.messagesApi(this.token_.access_token)
    }
  },
  methods: {
    send() {
      if (this.sending)
        return
      this.sending = true
      this.messagesApi.createMessage(this.model.key.trim(), this.model.val.trim(), this.client_.cid)
        .catch(this.$throw)
        .finally(() => this.sending = false)
    }
  }
}
</script>

<style scoped>

</style>
