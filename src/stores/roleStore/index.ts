import { IReactionDisposer, makeObservable, observable, reaction } from 'mobx'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import IRole from 'src/models/role/role.interface'
import RoleRepository from 'src/repos/v1/role'
import { RootStore } from '../root'
import Store from '../store'

export enum Roles {
  SuperAdmin = 0,
  ClientAdmin = 4,
  Admin = 2,
  SimUser = 6,
  ClientSubAdmin = 5,
  SimScorer = 7,
}

export enum RoleTitle {
  SuperAdmin = 'SuperAdmin',
  ClientAdmin = 'ClientAdmin',
  Admin = 'Admin',
  SimUser = 'SimUser',
  ClientSubAdmin = 'ClientSubAdmin',
  SimScorer = 'SimScorer',
}
export default class RoleStore extends Store<IRole> {
  form: IRole & Identifiable = {
    _id: null,
    title: '',
    priority: 0,
  }
  isScorer = false
  isAdmin = false
  roleHandler: IReactionDisposer | null = null

  constructor(store: RootStore, repository: RoleRepository) {
    super(store, repository)
    makeObservable(this, {
      form: observable,
    })
    this.roleHandler = reaction(
      () => this.rootStore.authStore.user,
      (user) => {
        if (user) {
          const title = user.role.title
          if (title === 'SimScorer') {
            this.isScorer = true
          } else if (['Admin', 'SuperAdmin'].includes(title)) {
            this.isAdmin = true
          } else {
            this.isAdmin = false
            this.isScorer = false
          }
        }
      }
    )
  }
}
