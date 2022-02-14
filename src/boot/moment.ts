import { boot } from 'quasar/wrappers';
import moment from 'moment';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $moment: Function;
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$moment = (date:any) => moment(date).format("YYYY-MM-DD HH:mm:ss")
});
