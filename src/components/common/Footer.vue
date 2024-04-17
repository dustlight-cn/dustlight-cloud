<template>
  <div class="q-ma-md text-center ">
    <div class="row">
      
      <q-space/>
      <q-btn target="_blank" href="https://beian.miit.gov.cn/" size="12px" dense no-caps flat
             label="粤ICP备17010183号-1"/>
      <q-space/>
      <q-btn target="_blank" href="https://github.com/dustlight-cn/dustlight-cloud" size="12px" dense no-caps flat
             icon="img:icons/github.png"
             label="View on Github"/>

      <language-selector class="q-mr-sm"/>
    </div>
  </div>
</template>

<script>
import LanguageSelector from "./LanguageSelector";

export default {
  name: "Footer",
  components: {LanguageSelector},
  data() {
    return {
    }
  }
}
</script>

<style scoped>

</style>
