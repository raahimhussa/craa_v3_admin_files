import { makeAutoObservable } from 'mobx'
import RoleStore from 'src/stores/roleStore'
import IRole from './role.interface'
export class Role implements IRole {
  store: RoleStore
  _id?: any
  title: string = ''
  priority: number = 0
  isDeleted?: boolean | undefined
  createdAt?: Date | undefined
  updatedAt?: Date | undefined

  constructor(store: RoleStore, data: IRole) {
    makeAutoObservable(this)
    this.store = store
    Object.assign(this, data)
  }
}
