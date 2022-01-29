import { MutationTree } from 'vuex';
import { ExampleStateInterface } from './state';

const mutation: MutationTree<ExampleStateInterface> = {
  someMutation(state: ExampleStateInterface, p) {
    state.test = p
  }
};

export default mutation;
