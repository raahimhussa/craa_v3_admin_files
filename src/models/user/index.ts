import IUser, { IProfile } from 'src/models/user/user.interface'

import AuthStore from 'src/stores/authStore'
import { Authority } from './types'
import _ from 'lodash'
import { makeAutoObservable } from 'mobx'

export default class User implements IUser {
  readonly _id!: any
  email!: string
  emailVerificationLink!: string
  aliasEmails!: string[]
  name!: string
  password!: string
  roleId!: string
  profile!: IProfile
  status: any
  authority!: Authority
  isActivated!: boolean
  isDeleted!: boolean
  updatedAt!: Date
  createdAt!: Date
  authStore: AuthStore
  whitelist: any

  constructor(authStore: AuthStore, data: IUser) {
    makeAutoObservable(this)
    this.authStore = authStore
    Object.assign(this, data)
  }

  *save() {
    const user = this.asJson()
    yield this.authStore.signup(user)
  }

  asJson() {
    return {
      email: this.email,
      name: this.name,
      password: this.password,
      roleId: this.roleId,
      profile: _.cloneDeep(this.profile),
      authority: this.authority,
      isDeleted: this.isDeleted,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    }
  }
}
