import {App} from "../App"
import i18n from "./i18n"
import routes from "./routes"
import ext from "./ext"

const app: App = {
  name: "fun",
  routes: routes,
  i18n: i18n,
  enabled: true,
  ext: ext,
  menus: [
    {
      name: "index",
      routeName: "index",
      i18nKey: "menu.index",
      icon: "code"
    },
    {
      name: "create",
      routeName: "create",
      i18nKey: "menu.create",
      icon: "cloud"
    }
  ]
}
export default app
