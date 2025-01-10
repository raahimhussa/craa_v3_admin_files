import IUser, { Profile } from 'src/models/user/user.interface'
import { action, makeObservable, observable } from 'mobx'

import { RootStore } from '../root'
import Store from '../store'
import User from 'src/models/user'
import UserRepository from 'src/repos/v1/user'
import { Utils } from '@utils'
import _ from 'lodash'
import { ResultsType, ResultsView } from 'src/utils/status'

export class UserStore extends Store<IUser> {
  form: IUser = {
    _id: undefined,
    email: '',
    roleId: '',
    name: '',
    profile: null,
    aliasEmails: [],
    status: null,
    emailVerificationLink: '',
    authority: {
      authorizedAll: false,
      pfizerAdmin: false,
      whitelist: [
        {
          clientId: '',
          businessUnits: [],
          countryPermissions: {},
          simPermissions: {},
          resultsView: ResultsView.Always,
          resultsType: ResultsType.Full,
          publishNotification: false,
          distributionNotification: false,
        },
      ],
    },
  }

  users: User[] = []

  constructor(rootStore: RootStore, repository: UserRepository) {
    super(rootStore, repository)
    makeObservable(this, {
      form: observable,
      addUser: action,
      users: observable,
    })
  }

  makeUsername() {
    return `user-${Utils.makeId(5)}`
  }

  addUser() {
    const user = new User(this.rootStore.authStore, _.cloneDeep(this.form))
    user.profile = new Profile()
    user.name = this.makeUsername()
    this.users.push(user)
  }
}
