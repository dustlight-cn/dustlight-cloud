<template>
  <client-required-adaptive-layout
    :title="$appt('menu.test')"
    v-slot="{client}">
    {{ client }}
  </client-required-adaptive-layout>
</template>

<script>
import ClientRequiredAdaptiveLayout from "src/components/container/ClientRequiredAdaptiveLayout";
export default {
  name: "Test",
  components: {ClientRequiredAdaptiveLayout},
  mounted() {
  }
}
</script>

<style scoped>

</style>
