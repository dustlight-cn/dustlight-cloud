<template>
  <q-page class="row items-center justify-evenly">
    <!-- OAuth2 Implict 授权模式  -->
    <auth-login
      :index="{
        path: '/',
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
