<template>
  <auth-user-context>
    <template v-slot:default="{user,token}">
      <slot :user="user" :token="token"/>
    </template>
    <template v-slot:unauthorized>
      <div class="row items-center justify-center">
        <div class="text-center">
          <q-icon color="grey" name="security" size="5em"/>

          <div class="flex flex-center q-mt-md text-h6 text-grey text-center">
            {{ $t("unauthorizedTips") }}
          </div>

          <div class="q-mt-sm">
            <q-btn :label="$t('signIn')" color="primary"
                   :to="{name:'login',query:{redirect_uri:this.$route.fullPath}}"/>
          </div>
        </div>
      </div>
    </template>
  </auth-user-context>
</template>

<script>
export default {
  name: "UserRequired"
}
</script>

<style scoped>

</style>
