import { BusinessUnit, IClientUnit } from './clientUnit.interface'

import ClientUnitStore from 'src/stores/clientUnitStore'
import { makeAutoObservable } from 'mobx'

export default class ClientUnit implements IClientUnit {
  store: ClientUnitStore

  constructor(store: ClientUnitStore, data: IClientUnit) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
    })
    Object.assign(this, data)
  }
  _id: any
  name!: string
  vendor!: string
  authCode!: string
  isScreenRecordingOn!: boolean
  whitelist!: string[]
  titles!: string[]
  businessUnits!: BusinessUnit[]

  date!: Date
  isDeleted!: boolean
  createdAt!: Date
  updatedAt!: Date
}
