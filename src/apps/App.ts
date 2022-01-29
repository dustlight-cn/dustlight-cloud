import {RouteRecordRaw} from "vue-router";
import app from "src/apps/test/app";

/**
 * 应用类
 */
export class App {
  public name: String | string = "" // 应用名称
  public routes: RouteRecordRaw[] = [] // 应用路由
  public i18n: Object | undefined | null // 国际化
  public enabled: boolean | undefined | null = true // 是否启用
}

// 注入上下文
function apply(routes: RouteRecordRaw[], app: App) {
  function inject(obj: any, app: App) {
    obj.app = app.name
    return obj
  }

  if (routes) {
    routes.forEach(route => {
      if (route.component) {
        if (route.component instanceof Function) {
          let old: Function = route.component
          // @ts-ignore
          route.component = () => old.apply().then(c => {
            inject(c.default, app)
            return c
          })
        } else {
          inject(route.component, app)
        }
      }

      if (route.children)
        apply(route.children, app)
    })
  }
}

// 输出路由
function computeRoute(app: App, prefix: string = "/"): RouteRecordRaw[] {
  if (app && app.routes) {
    apply(app.routes, app)
    app.routes.forEach(route => {
      // @ts-ignore
      let name: string = (route.name instanceof Symbol) ? route.name.toString() : route.name;
      route.name = app.name + "/" + name
      route.path = prefix + app.name + route.path
    })
    return app.routes
  }
  return []
}

/**
 * 输出路由
 * @param apps
 * @param prefix
 */
export function computeRoutes(apps: App[], prefix: string = "/"): RouteRecordRaw[] {
  let routes: RouteRecordRaw[] = []
  if (apps) {
    for (let i in apps) {
      routes.push(...computeRoute(apps[i]))
    }
  }
  return routes
}


/**
 * 注入 i18n
 * @param apps
 * @param message
 */
export function injectI18ns(apps: App[], message: any) {
  if (apps) {
    for (let i in apps) {
      let i18n = apps[i].i18n
      for (let k in i18n) {
        if (!message[k])
          message[k] = {}
        // @ts-ignore
        message[k][app.name] = i18n[k]
      }
    }
  }
}
