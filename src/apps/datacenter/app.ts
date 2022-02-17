import {App} from "../App"
import i18n from "./i18n"
import routes from "./routes"
import ext from "./ext"

const app: App = {
  name: "datacenter",
  routes: routes,
  i18n: i18n,
  enabled: true,
  ext: ext,
  menus: [
    {
      name: "forms",
      routeName: "forms",
      i18nKey: "menu.forms",
      icon: "list_alt"
    },
    {
      name: "records",
      routeName: "records",
      i18nKey: "menu.records",
      icon: "feed"
    }
  ]
}
export default app
