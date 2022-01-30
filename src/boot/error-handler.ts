import {boot} from 'quasar/wrappers';

function handleError(err: any) {
  console.error(err);
  let msg = {
    title: "Error",
    message: "Error",
    code: -1
  }
  if (err == null) {
    msg.message = "null"
  } else if (err.response && err.response.data && (err.response.data.details || err.response.data.code)) {
    msg.title = err.response.data.message;
    msg.message = err.response.data.details;
    msg.code = err.response.data.code;
  } else {
    msg.title = err.name;
    msg.message = err.message;
  }
  return msg
}

export default boot(({app}) => {
  app.config.globalProperties.$throw = (e: any) => {
    let msg = handleError(e)
    console.log("???", e)
    app.config.globalProperties.$q.notify({
      type: 'negative',
      message: msg.title,
      caption: (msg.message ? msg.message + " " : "") + (msg.code > 0 ? "(Error Code: " + msg.code + ")" : "")
    })
  }
});
