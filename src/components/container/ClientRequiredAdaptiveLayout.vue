<template>
  <adaptive-layout :title="title">
    <slot v-if="$route.query.cid"/>
    <div v-else class="row items-center justify-evenly">
      <div>
        <div>
          <q-icon name="apps"/>
        </div>
        <div>
          Client Required
        </div>
      </div>
    </div>
  </adaptive-layout>
</template>

<script>
import AdaptiveLayout from "./AdaptiveLayout";

export default {
  name: "ClientRequiredAdaptiveLayout",
  components: {AdaptiveLayout},
  props: {
    title: ""
  }
}
</script>

<style scoped>

</style>
