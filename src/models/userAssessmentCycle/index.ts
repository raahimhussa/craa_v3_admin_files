import { AssessmentCycle } from '../assessmentCycle'
import { IModel } from '../types'
import UserAssessmentCycleStore from 'src/stores/userAssessmentCycleStore'
import { makeAutoObservable } from 'mobx'

export default class UserAssessmentCycle implements IModel {
  _id: any

  assessmentCycle!: AssessmentCycle | undefined

  assessmentCycleId!: string

  assessmentTypeId!: string

  userBaselineId!: string

  clientUnitId!: string

  businessUnitId!: string

  businessCycleId!: string
  /**
   * @description when baseline is completed, then you must to change required false to true
   *  */
  userTrainingIds!: string[]
  /**
   * @description when baseline is completed, then you must to change required false to true
   *  */
  userFollowupIds!: string[]

  userId!: string

  verified!: boolean

  signedOff!: boolean

  signedOffDate!: Date | null

  bypass!: boolean

  isDeleted!: boolean

  createdAt!: Date

  updatedAt!: Date
  store: UserAssessmentCycleStore

  constructor(store: UserAssessmentCycleStore) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
      _id: false,
    })
  }

  load(data: any) {
    Object.assign(this, data)
  }
}
