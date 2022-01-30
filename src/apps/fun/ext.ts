import {Configuration, FunctionsApi, ConfigsApi} from '@dustlight/fun-client-axios-js'

const endpoint = "https://fun.dustlight.cn"

export default {
  basePath: endpoint,
  configsApi: new ConfigsApi(new Configuration({basePath: endpoint})),
  functionsApi: (token: any) => new FunctionsApi(new Configuration({basePath: endpoint, accessToken: token}))
}
