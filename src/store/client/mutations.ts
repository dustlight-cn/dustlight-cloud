import { MutationTree } from 'vuex';
import { ExampleStateInterface } from './state';

const mutation: MutationTree<ExampleStateInterface> = {
  setClient(state: ExampleStateInterface, client) {
    state.client = client
  }
};

export default mutation;
