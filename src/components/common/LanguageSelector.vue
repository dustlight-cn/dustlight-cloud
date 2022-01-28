<template>
  <div>
    <q-btn-dropdown no-caps dense flat :label="$q.lang.nativeName">
      <q-list>
        <q-item v-for="(item,index) in langOptions"
                :key="index"
                clickable
                v-close-popup
                @click="lang=item.value">
          <q-item-section>
            <q-item-label v-if="lang != item.value">{{ item.label }}</q-item-label>
            <q-item-label v-else class="text-primary">{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
import languages from 'quasar/lang/index.json'
import {Quasar} from "quasar";

export default {
  name: "LanguageSelector",
  data() {
    return {
      lang: this.$q.lang.isoName,
      langOptions: []
    }
  },
  methods: {
    changeLanguage(lang) {
      if (lang.startsWith('zh'))
        lang = 'zh-CN';
      else if (lang.startsWith('en'))
        lang = 'en-US';
      else {
        console.error("Language '" + lang + "' is not support!");
        lang = 'zh-CN';
      }

      this.$i18n.locale = lang;
      import(
        /* webpackInclude: /(zh-CN|en-US)\.js$/ */
      'quasar/lang/' + lang
        )
        .then(lang => {
          Quasar.lang.set(lang.default)
        })
      this.$q.localStorage.set("lang", lang);
    }
  },
  watch: {
    lang(lang) {
      this.changeLanguage(lang);
    }
  },
  created() {
    this.langOptions = languages.filter(lang =>
      ['en-US', 'zh-CN'].includes(lang.isoName)
    ).map(lang => ({
      label: lang.nativeName, value: lang.isoName
    }))
  }
}
</script>

<style scoped>

</style>
