import File from '../file'

export default interface IDoc {
  readonly _id: any
  kind: DocKind | null
  title: string
  htmlContent: string
  file: File | null
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export enum DocKind {
  Protocol = 'protocol',
  Instruction = 'instruction',
  StudyDocument = 'studyDocument',
  RiskManagement = 'riskManagement',
}
