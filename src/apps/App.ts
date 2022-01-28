import {RouteRecordRaw} from "vue-router";

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
      route.path = prefix + app.name + route.path
    })
    return app.routes
  }
  return []
}

// 输出路由
export function computeRoutes(apps: App[], prefix: string = "/"): RouteRecordRaw[] {
  let routes: RouteRecordRaw[] = []
  if (apps) {
    for (let i in apps) {
      routes.push(...computeRoute(apps[i]))
    }
  }
  return routes
}
