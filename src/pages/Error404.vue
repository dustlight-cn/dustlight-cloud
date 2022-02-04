<template>
  <q-page class="text-center flex flex-center">
    <div class="q-pa-md">
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2 q-mb-sm" style="opacity:.4">
        {{ $t('notFound') }}
      </div>

      <q-btn
        round
        icon="home"
        :to="{name: 'index'}"
        no-caps
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'Error404'
})
</script>
