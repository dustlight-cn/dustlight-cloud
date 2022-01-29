<template>
  <div class="q-ma-md text-center ">
    <div class="row">

      <q-space/>
      <q-btn @click="openURL('https://github.com/dustlight-cn/dustlight-cloud')" size="12px" dense no-caps flat
             icon="img:icons/github.png"
             label="View on Github"/>

      <language-selector class="q-mr-sm"/>
    </div>
  </div>
</template>

<script>
import {openURL} from 'quasar';
import LanguageSelector from "./LanguageSelector";

export default {
  name: "Footer",
  components: {LanguageSelector},
  data() {
    return {
      openURL: openURL
    }
  }
}
</script>

<style scoped>

</style>
