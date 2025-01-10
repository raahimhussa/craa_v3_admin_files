import { Authority } from './types'
import { UserStatus } from 'src/utils/status'
import { makeAutoObservable } from 'mobx'

export interface LocalUser {
  country: {
    _id: string
    name: string
  }
  profile: IProfile | null
}

export default interface IUser {
  _id: any
  email: string
  emailVerificationLink: string
  aliasEmails: string[]
  password?: string
  name: string
  roleId: string
  profile: IProfile | null
  authority: Authority
  status: any
}

export interface IProfile {
  userId: string
  countryId: string
  clientUnitId: string
  businessUnitId: string
  lastName: string
  firstName: string
  initial?: string
  status: UserStatus
  authCode: string
  title: string
  monitoring: number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export class Profile implements IProfile {
  _id: string = ''
  userId: string = ''
  countryId: string = ''
  clientUnitId: string = ''
  businessUnitId: string = ''
  lastName: string = ''
  firstName: string = ''
  status: UserStatus = UserStatus.Approval
  authCode: string = ''
  isDeleted: boolean = false
  createdAt: Date = new Date()
  updatedAt: Date = new Date()

  constructor() {
    makeAutoObservable(this)
  }
  title!: string
  monitoring!: number
}
