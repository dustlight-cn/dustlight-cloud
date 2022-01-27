<template>
  <q-page padding>
    <!-- OAuth2 Implict 授权模式  -->
    <auth-login
      :index="{
        path: 'test1',
      }"
      :help="{
      path:'/help'
      }"
    >
    </auth-login>
  </q-page>
</template>

<style lang="sass" scoped>
.directive-target
  width: 50px
  height: 50px
</style>
