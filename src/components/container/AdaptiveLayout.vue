<template>
  <div>
    <div v-if="$q.screen.gt.sm">
      <div v-if="title" class="text-subtitle1 q-pa-md">{{ title }}</div>
      <div class="q-pa-md">
        <slot/>
      </div>
    </div>
    <div v-else>
      <div class="q-pa-sm">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdaptiveLayout",
  props: {
    title: ""
  }
}
</script>

<style scoped>

</style>
