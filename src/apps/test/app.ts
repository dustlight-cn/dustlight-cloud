import {App} from "../App"
import i18n from "./i18n"
import routes from "./routes"
import ext from "./ext"

const app: App = {
  name: "test",
  routes: routes,
  i18n: i18n,
  enabled: true,
  ext: ext,
  menus: [
    {
      name: "index",
      routeName: "index",
      i18nKey: "menu.index",
      icon: "home"
    },
    {
      name: "test",
      routeName: "test",
      i18nKey: "menu.test",
      icon: "apps"
    }
  ]
}
export default app
