import {
  AssessmentStatus,
  ScorerStatus,
  SimulationType,
} from 'src/utils/status'
import { IAssessment, Scorer } from './assessment.interface'

import AssessmentStore from 'src/stores/assessmentTypeStore'
import DefaultSchema from 'src/commons/interfaces/defaultSchema.interface'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import { makeAutoObservable } from 'mobx'

export default class Assessment
  implements IAssessment, Identifiable, DefaultSchema
{
  answers(answers: any, arg1: (answer: any) => any) {
    throw new Error('Method not implemented.')
  }
  store: AssessmentStore
  _id: any
  userSimulationId!: string
  scorers: Scorer[] = []
  isExpedited!: false
  firstScorer!: { _id: string; status: ScorerStatus; scoringTime: number }
  secondScorer!: { _id: string; status: ScorerStatus; scoringTime: number }
  adjudicator!: { _id: string; status: ScorerStatus }
  isDeleted!: boolean
  createdAt!: Date
  updatedAt!: Date
  status!: string
  publishedAt!: Date | null

  constructor(store: AssessmentStore, data: IAssessment) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
    })
    Object.assign(this, data)
  }
  userAssessmentCycle: any
}
