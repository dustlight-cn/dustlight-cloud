<template>
    <adaptive-layout :title="title">
      <user-required>
        <template v-slot:default="{user,token}">
          <slot v-if="$store.state.client.client"
                :client="$store.state.client.client"
                :user="user"
                :token="token"/>
          <div v-else >
            <div class="text-center">
              <q-icon color="grey" name="apps" size="5em"/>

              <div class="flex flex-center q-mt-md text-h6 text-grey text-center">
                {{ $t("unselectClientTips") }}
              </div>
              <div class="text-left">
                <user-client-list :user="user" :token="token"
                                  @onSelected="(client)=>$store.commit('client/setClient',client)"/>
              </div>
            </div>
          </div>
        </template>
      </user-required>
    </adaptive-layout>
</template>

<script>
import AdaptiveLayout from "./AdaptiveLayout";
import ClientSelector from "components/common/ClientSelector";
import UserRequired from "components/common/UserRequired";

export default {
  name: "ClientRequiredAdaptiveLayout",
  components: {UserRequired, ClientSelector, AdaptiveLayout},
  props: {
    title: ""
  }
}
</script>

<style scoped>

</style>
