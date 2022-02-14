import {
  Configuration,
  ChannelsApi,
  MessagesApi,
  TemplatesApi,
  NotificationsApi
} from '@dustlight/messenger-client-axios-js'

import {UsersApi} from "@dustlight/auth-client-axios-js"

const endpoint = "https://messenger.dustlight.cn"
// @ts-ignore
const authEndpoint = process.env.auth["config.apiEndpoint"]


declare interface Ext {
  basePath: string
  channelsApi: (token: any) => ChannelsApi
  messagesApi: (token: any) => MessagesApi,
  templatesApi: (token: any) => TemplatesApi,
  notificationsApi: (token: any) => NotificationsApi,
  usersApi: (token: any) => UsersApi
}

const ext: Ext = {
  basePath: endpoint,
  channelsApi: (token: any) => new ChannelsApi(new Configuration({basePath: endpoint, accessToken: token})),
  messagesApi: (token: any) => new MessagesApi(new Configuration({basePath: endpoint, accessToken: token})),
  templatesApi: (token: any) => new TemplatesApi(new Configuration({basePath: endpoint, accessToken: token})),
  notificationsApi: (token: any) => new NotificationsApi(new Configuration({basePath: endpoint, accessToken: token})),
  usersApi: (token: any) => new UsersApi(new Configuration({basePath: authEndpoint, accessToken: token}))
}

export default ext
