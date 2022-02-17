import {
  Configuration,
  ConfigurationsApi,
  ObjectsApi
} from '@dustlight/storaging-client-axios-js'

import {UsersApi} from "@dustlight/auth-client-axios-js"

const endpoint = "https://storaging.dustlight.cn"
// @ts-ignore
const authEndpoint = process.env.auth["config.apiEndpoint"]
const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

function bytesToSize(len: number | undefined | null) {
  if(len == undefined || null){
    return "-"
  }
  if (len === 0) return '0 B';
  let i = Math.floor(Math.log(len) / Math.log(1024));
  return (len / Math.pow(1024, i)).toPrecision(3) + ' ' + sizes[i];
}

declare interface Ext {
  basePath: string
  configsApi: (token: any) => ConfigurationsApi
  objectsApi: (token: any) => ObjectsApi,
  usersApi: (token: any) => UsersApi
  byteString: (len: number | undefined | null) => string
}

const ext: Ext = {
  basePath: endpoint,
  configsApi: (token: any) => new ConfigurationsApi(new Configuration({basePath: endpoint, accessToken: token})),
  objectsApi: (token: any) => new ObjectsApi(new Configuration({basePath: endpoint, accessToken: token})),
  usersApi: (token: any) => new UsersApi(new Configuration({basePath: authEndpoint, accessToken: token})),
  byteString: bytesToSize
}

export default ext
