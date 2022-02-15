import {BasicMessage} from "@dustlight/messenger-client-axios-js";

export default class MessageStore {
  private db?: IDBDatabase
  private cid: string
  private uid: string

  constructor(cid: string, uid: string, db?: IDBDatabase) {
    this.db = db
    this.uid = uid
    this.cid = cid
  }

  private onupgradeneeded() {
    let store = this.db?.createObjectStore(this.cid, {
      keyPath: "id"
    })
    store?.createIndex("sender","sender")
  }

  public static open(cid: string, uid: string): Promise<MessageStore> {
    return new Promise<MessageStore>((resolve, reject) => {
      let store = new MessageStore(cid, uid)

      let request = indexedDB.open("messages-" + uid)
      request.onupgradeneeded = (event) => {
        // @ts-ignore
        store.db = event.target.result
        store.onupgradeneeded()
      }
      request.onsuccess = (event) => {
        // @ts-ignore
        store.db = event.target.result
        resolve(store)
      }
      request.onerror = (e) => reject(e)
    })
  }

  public add(message: BasicMessage | Object): Promise<void> {
    return new Promise<void>(((resolve, reject) => {
      let req = this.db?.transaction([this.cid], "readwrite")
        .objectStore(this.cid)
        .add(message)
      if (req) {
        req.onsuccess = (e) => resolve()
        req.onerror = reject
      } else
        reject("DB is null!");
    }))
  }

  public close(){
    this.db?.close()
  }
}
