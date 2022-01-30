import { MutationTree } from 'vuex';
import {ExampleStateInterface} from './state';
import {SessionStorage} from "quasar";

const mutation: MutationTree<ExampleStateInterface> = {
  setClient(state: ExampleStateInterface, client) {
    state.client = client
    SessionStorage.set('client', client)
  }
};

export default mutation;
