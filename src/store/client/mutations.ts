import { MutationTree } from 'vuex';
import {ExampleStateInterface} from './state';
import {LocalStorage} from "quasar";

const mutation: MutationTree<ExampleStateInterface> = {
  setClient(state: ExampleStateInterface, client) {
    state.client = client
    LocalStorage.set('client', client)
  }
};

export default mutation;
