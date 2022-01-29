export interface ExampleStateInterface {
  prop: boolean;
  test: Object
}

function state(): ExampleStateInterface {
  return {
    prop: false,
    test: {}
  }
};

export default state;
