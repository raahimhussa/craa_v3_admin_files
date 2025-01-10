import { makeAutoObservable } from 'mobx'
import AssessmentTypeStore from 'src/stores/assessmentTypeStore'
import IAssessmentType, { ATBaseline, ATFollowup, ATTraining } from './assessmentType.interface'

export default class AssessmentType implements IAssessmentType {
  _id: any | null = null
  label: string = ''
  baseline: ATBaseline | null = null
  followups: ATFollowup[] = []
  trainings: ATTraining[] = []
  isDeleted: boolean = false
  store: AssessmentTypeStore

  constructor(store: AssessmentTypeStore, data: IAssessmentType) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
    })
    Object.assign(this, data)
  }
}
