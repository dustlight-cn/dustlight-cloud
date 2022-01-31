import {Configuration, ProcessesApi, InstancesApi} from '@dustlight/flow-client-axios-js'

const endpoint = "https://flow.dustlight.cn"

declare interface Ext {
  basePath: string
  instancesApi: (token: any) => InstancesApi
  processApi: (token: any) => ProcessesApi
}

const ext: Ext = {
  basePath: endpoint,
  instancesApi: (token: any) => new InstancesApi(new Configuration({basePath: endpoint, accessToken: token})),
  processApi: (token: any) => new ProcessesApi(new Configuration({basePath: endpoint, accessToken: token}))
}

export default ext
