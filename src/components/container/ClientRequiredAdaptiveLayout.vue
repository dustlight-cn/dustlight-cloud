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
              <div>
                <q-icon color="primary" size="10em" name="apps"/>
              </div>
              <div>
                Select Client
                <client-selector/>
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
