import { UserStatus } from 'src/utils/status'

export default interface IProfile {
  readonly userId: string
  readonly countryId: string
  readonly clientId: string
  readonly businessUnitId: string
  readonly lastName: string
  readonly firstName: string
  readonly status: UserStatus
  readonly authCode: string
  readonly isDeleted: boolean
  readonly createdAt: Date
  readonly updatedAt: Date
}
