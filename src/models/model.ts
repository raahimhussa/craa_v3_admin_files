import { makeObservable } from 'mobx'

class Model<D, S> {
  store: S
  constructor(store: S, data: D) {
    this.store = store
    Object.assign(this, data)
    makeObservable(this)
  }
}

export default Model
