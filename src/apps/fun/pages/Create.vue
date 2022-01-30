<template>
  <client-required-adaptive-layout
    :title="$appt('menu.create')"
    v-slot="{client,user,token}">
    {{ "", client_ = client, user_ = user, token_ = token }}
    <q-form @submit="create" class="q-gutter-sm">
      <q-input v-model="model.name" filled :label="$appt('functionName')"/>
      <div class="text-right q-mt-md">
        <q-btn no-caps color="primary" :label="$appt('create')"/>
      </div>
    </q-form>
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "src/components/container/ClientRequiredAdaptiveLayout";

export default {
  name: "Test",
  components: {ClientRequiredAdaptiveLayout},
  data() {
    return {
      model: {
        name: ""
      }
    }
  },
  methods: {
    create() {

    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
