<template>
  <div class="q-ma-md text-center ">
    <div>
      <q-btn @click="openURL('https://github.com/dustlight-cn/dustlight-cloud')" size="12px" dense no-caps flat
             icon="img:icons/github.png"
             label="View on Github"/>
    </div>

  </div>
</template>

<script>
import {openURL} from 'quasar';

export default {
  name: "Footer",
  data() {
    return {
      openURL: openURL
    }
  }
}
</script>

<style scoped>

</style>
