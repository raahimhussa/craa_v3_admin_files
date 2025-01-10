import { UserStatus } from 'src/utils/status'

export interface Profile {
  readonly userId: string
  readonly countryId: string
  readonly clientId: string
  readonly businessUnitId: string
  readonly lastName: string
  readonly firstName: string
  readonly title: string
  readonly status: UserStatus
  readonly authCode: string
  readonly isDeleted: boolean
  readonly createdAt: Date
  readonly updatedAt: Date
}

export interface Authority {
  authorizedAll: boolean
  whitelist: ClientUnitAuthority[]

  pfizerAdmin: boolean
}

export interface ClientUnitAuthority {
  clientId: string
  businessUnits: string[]
  countryPermissions: any
  simPermissions: any
  resultsView: string
  resultsType: string
  publishNotification: boolean
  distributionNotification: boolean
}
