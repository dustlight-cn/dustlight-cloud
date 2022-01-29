import zhCN from './zh-CN';
import enUS from './en-US';
import {injectI18ns} from "src/apps/App";
import apps from '../apps'

const message = {
  'zh-CN': zhCN,
  'en-US': enUS
};
// @ts-ignore
injectI18ns(apps, message)

export default message;
