import {App} from "../App"
import i18n from "./i18n"
import routes from "./routes"
import ext from "./ext"

const app: App = {
  name: "messenger",
  routes: routes,
  i18n: i18n,
  enabled: true,
  ext: ext,
  menus: [
    {
      name: "notifications",
      routeName: "notifications",
      i18nKey: "menu.notifications",
      icon: "notifications"
    },
    {
      name: "templates",
      routeName: "templates",
      i18nKey: "menu.templates",
      icon: "wysiwyg"
    },
    {
      name: "channels",
      routeName: "channels",
      i18nKey: "menu.channels",
      icon: "router"
    },
    {
      name: "messages",
      routeName: "messages",
      i18nKey: "menu.messages",
      icon: "message"
    }
  ]
}
export default app
