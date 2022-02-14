<template>
  <client-required-adaptive-layout
    :title="$appt('newNotification')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}

    <q-form class="q-gutter-md" @submit="create">
      <q-input :debounce="500" v-model="model.template" filled :label="$appt('menu.templates')"
               lazy-rules
               :disable="creating"
               :rules="rules.template">
        <template v-slot:prepend>
          <q-icon name="wysiwyg"/>
        </template>
        <template v-slot:after>
          <q-btn :loading="creating" flat round icon="search" @click="selectTemplate"/>
        </template>
      </q-input>

      <div v-if="template">
        <q-editor v-model="template.content" readonly :toolbar="[]"/>
      </div>

      <q-input :debounce="500" v-model="model.channel" filled :label="$appt('menu.channels')"
               lazy-rules
               :disable="creating"
               :rules="rules.channel">
        <template v-slot:prepend>
          <q-icon name="router"/>
        </template>
        <template v-slot:after>
          <q-btn :loading="creating" flat round icon="search" @click="selectChannel"/>
        </template>
      </q-input>

      <div v-if="channel">
        <q-item>
          <q-item-section avatar>
            <q-icon name="router"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ channel.name }}</q-item-label>
            <q-item-label caption>{{ channel.description }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <div class="text-subtitle2">{{ $appt('variables') }}</div>
      <q-list separator>
        <q-item v-for="(val,key) in model.content" :key="key">
          <q-item-section>
            <q-item-label>{{ key }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ JSON.stringify(val) }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn :disable="creating" flat round dense icon="remove" @click="()=>delete model.content[key]"/>
          </q-item-section>
        </q-item>
        <q-form
          @submit="()=>{ model.content[model.field.key]=JSON.parse(model.field.value); }">
          <q-item>
            <q-item-section>
              <q-input :rules="rules.variableName" :label="$appt('variableName')" v-model="model.field.key" filled
                       dense/>
            </q-item-section>
            <q-item-section>
              <q-input :rules="rules.variableValue" :label="$appt('variableValue')" v-model="model.field.value" filled
                       dense/>
            </q-item-section>
            <q-item-section side top>
              <q-btn :loading="creating" flat round dense icon="add" type="submit"/>
            </q-item-section>
          </q-item>
        </q-form>
      </q-list>

      <div class="text-right">
        <q-btn no-caps color="primary" type="submit" icon="notifications" :label="$q.lang.label.create"/>
      </div>
    </q-form>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
import ChannelDialog from "../components/ChannelDialog";
import TemplateDialog from "../components/TemplateDialog";

export default {
  name: "NewNotifications",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      client_: null,
      user_: null,
      token_: null,
      type: "EMAIL",
      template: null,
      channel: null,
      creating: false,
      model: {
        template: this.$route.query.template || "",
        channel: this.$route.query.channel || "",
        content: {},
        field: {
          key: "",
          value: ""
        }
      },
      rules: {
        template: [
          val => val && val.trim().length > 0 || this.$appt('notEmpty'),
          val => this.promises.template ? this.promises.template :
            (this.promises.template = this.templatesApi.getTemplate(val.trim(), this.type, this.client_.cid)
                .then(res => {
                  this.template = res.data
                  return true
                })
                .catch(e => e.response && e.response.data.message ? e.response.data.message : (e.message || e))
                .finally(() => this.promises.template = null)
            )
        ],
        channel: [
          val => val && val.trim().length > 0 || this.$appt('notEmpty'),
          val => this.promises.channel ? this.promises.channel :
            (this.promises.channel = this.channelsApi.getChannel(val.trim(), this.client_.cid)
                .then(res => {
                  this.channel = res.data
                  return true
                })
                .catch(e => e.response && e.response.data.message ? e.response.data.message : (e.message || e))
                .finally(() => this.promises.channel = null)
            )
        ],
        variableName: [val => val && val.trim().length > 0 || this.$appt('notEmpty')],
        variableValue: [
          val => val && val.trim().length > 0 || this.$appt('notEmpty'),
          val => {
            try {
              JSON.parse(val)
              return true
            } catch (e) {
              return e.message
            }
          }
        ]
      },
      promises: {
        template: null,
        channel: null
      }
    }
  },
  watch: {
    "model.template"() {

    },
    "model.channel"() {

    },
    token_() {
      if (this.model.channel) {
        this.rules.channel.forEach(rule => rule(this.model.channel))
      }
      if (this.model.template) {
        this.rules.template.forEach(rule => rule(this.model.template))
      }
    },
    client_() {
      if (this.model.channel) {
        this.rules.channel.forEach(rule => rule(this.model.channel))
      }
      if (this.model.template) {
        this.rules.template.forEach(rule => rule(this.model.template))
      }
    }
  },
  computed: {
    /**
     *
     * @returns {NotificationsApi}
     */
    notificationsApi() {
      return this.$options.ext.notificationsApi(this.token_.access_token)
    }, /**
     *
     * @returns {TemplatesApi}
     */
    templatesApi() {
      return this.$options.ext.templatesApi(this.token_.access_token)
    }, /**
     *
     * @returns {ChannelsApi}
     */
    channelsApi() {
      return this.$options.ext.channelsApi(this.token_.access_token)
    },
  },
  methods: {
    selectChannel() {
      this.$q.dialog({
        component: ChannelDialog,
        componentProps: {
          token: this.token_,
          client: this.client_
        }
      }).onOk(val => {
        this.model.channel = val.id
        this.channel = val
      })
    },
    selectTemplate() {
      this.$q.dialog({
        component: TemplateDialog,
        componentProps: {
          token: this.token_,
          client: this.client_
        }
      }).onOk(val => {
        this.model.template = val.id
        if (this.model.template) {
          this.rules.template.forEach(rule => rule(this.model.template))
        }
      })
    },
    create() {
      if (this.creating)
        return
      this.creating = true
      this.notificationsApi.createNotification({
        templateId: this.model.template,
        channelId: this.model.channel,
        content: this.model.content
      }, this.type, this.client_.cid)
        .then(res => {
          this.$router.push({
            name: this.$options.app + '/notifications',
            query: {
              template: res.data.templateId,
              channel: res.data.channelId
            }
          })
        })
        .catch(this.$throw)
        .finally(() => this.creating = false)
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
