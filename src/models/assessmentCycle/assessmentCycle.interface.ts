import { AssessmentCycleType } from 'src/ui/pages/admin/AssessmentCycle/AssessmentCycleView'

export class Tutorials {
  followupUrl?: string
  baselineUrl?: string
  trainingUrl?: string
}

export default interface IAssessmentCycle {
  readonly _id: any
  name: string
  type?: AssessmentCycleType
  tutorials: Tutorials
  assessmentTypeIds: string[]
  bypass: boolean
  startDate: Date
  endDate: Date
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
