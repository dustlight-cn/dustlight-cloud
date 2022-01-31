import {Client} from '@dustlight/auth-client-axios-js'
import {LocalStorage} from "quasar";

export interface ExampleStateInterface {
  prop: boolean;
  client: Client | undefined | null
}

function state(): ExampleStateInterface {
  return {
    prop: false,
    client: LocalStorage.getItem<Client>('client')
  }
};

export default state;
