import { makeAutoObservable } from 'mobx'
import IPolicy from 'src/models/policy/policy.interface'
import PolicyStore from 'src/stores/policyStore'
import { IModel } from '../types'

export default class Policy implements IModel, IPolicy {
  store: PolicyStore
  _id?: any
  domainId: string = ''
  description: string = ''
  isDeleted?: boolean | undefined
  createdAt?: Date | undefined
  updatedAt?: Date | undefined

  constructor(store: PolicyStore, data: IPolicy) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
    })
    Object.assign(this, data)
  }
  label: string = ''
  allowedPages: string[] = []
  allowedActions: string[] = []

  load(data: any) {
    Object.assign(this, data)
  }
}
