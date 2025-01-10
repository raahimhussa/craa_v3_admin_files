import DomainStore from 'src/stores/domainStore'
import IDomain from 'src/models/domain/domain.interface'
import { IModel } from '../types'
import { makeAutoObservable } from 'mobx'

export default class Domain implements IModel, IDomain {
  store: DomainStore
  _id?: any
  visibleId?: number
  seq: number = 0
  depth: number = 0
  name: string = ''
  isDeleted?: boolean | undefined
  createdAt?: Date | undefined
  updatedAt?: Date | undefined
  children: IDomain[] = []
  parentId!: string
  followupNumber?: number

  constructor(store: DomainStore, data: IDomain) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
    })
    Object.assign(this, data)
  }

  load(data: any) {
    Object.assign(this, data)
  }
}
