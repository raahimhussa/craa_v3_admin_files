import {
  AssessmentStatus,
  ScorerStatus,
  SimulationType,
} from 'src/utils/status'

import IFinding from '../finding/finding.interface'

export class Scorer {
  userId: string = ''
  name: string = ''
}

export class Adjudicator {
  userId: string = ''
  name: string = ''
}

export interface IAssessment {
  userAssessmentCycle: any
  _id: any
  // results: Result[]
  userSimulationId: string
  status: string
  // scorers: Scorer[]
  // adjudicator: Adjudicator
  isExpedited: boolean
  firstScorer: {
    _id: string
    status: ScorerStatus
    scoringTime: number
  }
  secondScorer: {
    _id: string
    status: ScorerStatus
    scoringTime: number
  }
  adjudicator: {
    _id: string
    status: ScorerStatus
  }

  publishedAt: Date | null

  createdAt: Date

  updatedAt: Date
}
