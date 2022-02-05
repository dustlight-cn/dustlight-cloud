import {Configuration, ProcessesApi, InstancesApi, MessagesApi} from '@dustlight/flow-client-axios-js'

const endpoint = "https://flow.dustlight.cn"

declare interface Ext {
  basePath: string
  instancesApi: (token: any) => InstancesApi
  processApi: (token: any) => ProcessesApi,
  messagesApi: (token: any) => MessagesApi,
  getStatusColor: (status: string) => string,
  getStatusIcon: (status: string) => string
}

const ext: Ext = {
  basePath: endpoint,
  instancesApi: (token: any) => new InstancesApi(new Configuration({basePath: endpoint, accessToken: token})),
  processApi: (token: any) => new ProcessesApi(new Configuration({basePath: endpoint, accessToken: token})),
  messagesApi: (token: any) => new MessagesApi(new Configuration({basePath: endpoint, accessToken: token})),
  getStatusColor(status) {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INCIDENT':
        return 'red';
      case 'RESOLVE':
        return 'blue';
      case 'CANCELED':
      case 'COMPLETED':
      default:
        return 'grey'
    }
  },
  getStatusIcon(status) {
  switch (status) {
    case 'ACTIVE':
      return 'fas fa-play';
    case 'INCIDENT':
      return 'error';
    case 'RESOLVE':
      return 'fas fa-refresh';
    case 'CANCELED':
      return 'fas fa-times'
    case 'COMPLETED':
      return 'check'
    default:
      return 'question'
  }
},
}

export default ext
