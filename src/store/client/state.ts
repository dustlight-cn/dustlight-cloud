import {Client} from '@dustlight/auth-client-axios-js'
export interface ExampleStateInterface {
  prop: boolean;
  client: Client | undefined | null
}

function state(): ExampleStateInterface {
  return {
    prop: false,
    client: null
  }
};

export default state;
