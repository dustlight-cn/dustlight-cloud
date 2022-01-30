<template>
  <client-required-adaptive-layout
    :title="$appt('menu.index')"
    v-slot="{client,user}">
    {{ client }}
    {{ user }}
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "../../../components/container/ClientRequiredAdaptiveLayout";
export default {
  name: "Index",
  components: {ClientRequiredAdaptiveLayout},
  mounted() {
  }
}
</script>

<style scoped>

</style>
