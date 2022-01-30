<template>
  <div>
    <q-btn v-if="$q.screen.gt.xs" :to="{name:'index'}" dense no-caps icon="img:/icons/favicon-128x128.png" flat :label="$t('title')"/>
    <q-btn v-else :to="{name:'index'}" no-caps round dense icon="img:/icons/favicon-128x128.png" flat :aria-label="$t('title')"/>
  </div>
</template>

<script>
export default {
  name: "Logo"
}
</script>

<style scoped>

</style>
