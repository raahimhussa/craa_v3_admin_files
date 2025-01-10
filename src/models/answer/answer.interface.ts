import { AnswerStatus } from 'src/utils/status'
import IFinding from '../finding/finding.interface'

export default interface IAnswer {
  _id?: any | null
  assessmentId: string
  // noteId: string | null
  simDocId: string
  // status: AnswerStatus
  findingId: string
  finding?: IFinding
  // scorerId: string
  scoring: Scoring
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export class Scoring {
  firstScorer!: {
    scorerId: string
    noteId: string | null
    answerStatus: AnswerStatus
    updatedAt: Date
  }
  secondScorer!: {
    scorerId: string
    noteId: string | null
    answerStatus: AnswerStatus
    updatedAt: Date
  }
  adjudicator!: {
    scorerId: string
    noteId: string | null
    answerStatus: AnswerStatus
    updatedAt: Date
  }
}
