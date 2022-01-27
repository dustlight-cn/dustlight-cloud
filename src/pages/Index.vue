<template>
  <q-page class="row items-center justify-evenly">
    <auth-user-context v-slot="{user,token}">
      {{ $t("success") }}
      <auth-avatar :user="user"/>
    </auth-user-context>
  </q-page>
</template>

<script>

export default {
  name: 'PageIndex'
}
</script>
