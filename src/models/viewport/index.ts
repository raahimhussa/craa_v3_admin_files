import { IModel } from '../types'
import { IViewport } from './types'
import SimDoc from '../simDoc'
import ViewportStore from 'src/stores/viewportStore'
import { makeAutoObservable } from 'mobx'

export default class Viewport implements IModel, IViewport {
  _id: any = null
  active: boolean = false
  index: number = 0
  userId: string = ''
  simulationId: string = ''
  userSimulationId: string = ''
  simDoc: SimDoc | null = null
  viewedSimDocIds: Array<number> = []
  isDeleted: boolean = false
  isMounted: boolean = false
  createdAt: number = Date.now()
  updatedAt: number = Date.now()

  filter = {
    _id: this._id,
  }
  store: ViewportStore | null
  constructor(store: ViewportStore) {
    makeAutoObservable(this, {
      store: false,
      _id: false,
    })
    this.store = store
  }

  load(data: any) {
    Object.assign(this, data)
  }
}
