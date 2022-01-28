import {Quasar, LocalStorage} from 'quasar'

export default async () => {
  const langIso = LocalStorage.getItem('lang') || Quasar.lang.getLocale(); // ... some logic to determine it (use Cookies Plugin?)

  try {
    await import(
      /* webpackInclude: /(zh-CN|en-US)\.js$/ */
    'quasar/lang/' + langIso
      )
      .then(lang => {
        Quasar.lang.set(lang.default)
      })
  } catch (err) {
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
    console.error(err)
  }
}
