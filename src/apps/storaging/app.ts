import {App} from "../App"
import i18n from "./i18n"
import routes from "./routes"
import ext from "./ext"

const app: App = {
  name: "storage",
  routes: routes,
  i18n: i18n,
  enabled: true,
  ext: ext,
  menus: [
    {
      name: "objects",
      routeName: "objects",
      i18nKey: "menu.objects",
      icon: "storage"
    },
    {
      name: "configs",
      routeName: "configs",
      i18nKey: "menu.configs",
      icon: "save_as"
    }
  ]
}
export default app
