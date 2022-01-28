const appPaths = require.context('./', true, /^\.\/.*\/app.ts$/).keys()

const apps = {}

appPaths.forEach(path => {
  let appModule = require("../apps" + path.substr(1))
  process(appModule.default)
})

function process(app) {
  if (app) {
    if(!app.enabled){
      console.warn("app disabled. [" + app.name + "]")
      return
    }
    if (!app.name) {
      console.warn("app name missing!")
      return
    }
    if(apps[app.name]){
      console.warn("app name conflict! [" + app.name + "]")
      return
    }
    apps[app.name] = app
  }
}

export default apps
