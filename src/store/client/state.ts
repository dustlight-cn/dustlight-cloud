import {Client} from '@dustlight/auth-client-axios-js'
import {SessionStorage} from "quasar";

export interface ExampleStateInterface {
  prop: boolean;
  client: Client | undefined | null
}

function state(): ExampleStateInterface {
  return {
    prop: false,
    client: SessionStorage.getItem<Client>('client')
  }
};

export default state;
