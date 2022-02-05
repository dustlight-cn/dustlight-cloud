import {App} from "../App"
import i18n from "./i18n"
import routes from "./routes"
import ext from "./ext"

const app: App = {
  name: "flow",
  routes: routes,
  i18n: i18n,
  enabled: true,
  ext: ext,
  menus: [
    {
      name: "processes",
      routeName: "processes",
      i18nKey: "menu.processes",
      icon: "account_tree"
    },
    {
      name: "instances",
      routeName: "instances",
      i18nKey: "menu.instances",
      icon: "play_arrow"
    },
    {
      name: "message",
      routeName: "message",
      i18nKey: "menu.message",
      icon: "mail"
    },
    {
      name: "triggers",
      routeName: "triggers",
      i18nKey: "menu.triggers",
      icon: "cable"
    }
  ]
}
export default app
