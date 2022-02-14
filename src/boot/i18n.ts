import { boot } from 'quasar/wrappers';
import {createI18n} from 'vue-i18n';
import {Quasar, LocalStorage} from 'quasar'

import messages from 'src/i18n';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $appt: Function;
  }
}

export default boot(({ app }) => {
  const langIso = LocalStorage.getItem<string>('lang') || Quasar.lang.getLocale(); // ... some logic to determine it (use Cookies Plugin?)

  const i18n = createI18n({
    locale: langIso,
    messages,
    fallbackLocale: 'zh-CN'
  });

  // Set i18n instance on app
  app.use(i18n);

  // 添加全局函数 $appt 用于国际化文本
  app.config.globalProperties.$appt = function (key: string, ...args: any) {
    return this.$t(this.$options.app + "." + key, ...args)
  }
});
