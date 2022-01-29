import {App} from "../App"
import i18n from "./i18n"
import routes from "./routes"

const app: App = {
  name: "test2",
  routes: routes,
  i18n: i18n,
  enabled: true,
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
