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
      icon: "fas fa-code-branch"
    },
    {
      name: "instances",
      routeName: "instances",
      i18nKey: "menu.instances",
      icon: "fas fa-play"
    },
    {
      name: "message",
      routeName: "message",
      i18nKey: "menu.message",
      icon: "email"
    }
  ]
}
export default app
