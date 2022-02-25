import {Configuration, FormsApi, RecordsApi} from "@dustlight/datacenter-client-axios-js"

const endpoint = "https://datacenter.dustlight.cn"

interface Ext {
  basePath: string
  formsApi: (token: any) => FormsApi
  recordsApi: (token: any) => RecordsApi
}

const ext: Ext = {
  basePath: endpoint,
  formsApi: (token: any) => new FormsApi(new Configuration({basePath: endpoint, accessToken: token})),
  recordsApi: (token: any) => new RecordsApi(new Configuration({basePath: endpoint, accessToken: token})),
}

export default ext
