import { GradeType } from 'src/utils/status'
import { makeAutoObservable } from 'mobx'

export class ClientUnit {
  constructor() {
    makeAutoObservable(this)
  }
  _id!: string
  name!: string
  vendor!: string
  authCode!: string
  isScreenRecordingOn!: boolean
  whitelist!: Array<string>
  titles!: Array<string>
  businessUnits!: BusinessUnit[]
  isDeleted!: boolean
  createdAt!: Date
  updatedAt!: Date
}

export class BusinessUnit {
  constructor() {
    makeAutoObservable(this)
  }
  _id!: string
  name!: string
  countryIds!: string[]
  adminCountryIds!: string[]
  businessCycles!: BusinessCycle[]
}

export class BusinessCycle {
  constructor() {
    makeAutoObservable(this)
  }
  _id!: string
  assessmentCycleId!: string
  settingsByDomainIds!: SettingsByDomainId[]
  isScreenRecordingOn!: boolean
  gradeType!: GradeType
  startDate?: Date
  endDate?: Date
}

export class SettingsByDomainId {
  constructor() {
    makeAutoObservable(this)
  }
  domainId!: string
  minScore!: number
}

export interface IClientUnit {
  _id: any
  name: string
  vendor: string
  authCode: string
  isScreenRecordingOn: boolean
  whitelist: Array<string>
  businessUnits: BusinessUnit[]
  titles: Array<string>
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
}
