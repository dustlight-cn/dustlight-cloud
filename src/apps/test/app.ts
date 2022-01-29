import {App} from "../App"
import i18n from "./i18n"
import routes from "./routes"

const app: App = {
  name: "test",
  routes: routes,
  i18n: i18n,
  enabled: true,
  menu: [
    {
      name: "index",
      routeName: "index",
      i18nKey: null,
      icon: null
    },
    {
      name: "test",
      routeName: "test",
      i18nKey: null,
      icon: null
    }
  ]
}
export default app
