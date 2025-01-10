export default interface IAssessmentType {
  _id?: any
  label: string
  baseline: ATBaseline | null
  followups: Array<ATFollowup>
  trainings: Array<ATTraining>
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export class ATFollowup {
  readonly _id: string = ''
  name: string = ''
  label: string = ''
  simulationId: string = ''
  testTime: number = 0
  minimumHour: number = 0
  deadline: number = 0
  protocolIds: string[] = []
  instructionIds: string[] = []
  studyLogIds: string[] = []
  riskManagementIds: string[] = []
  domain: any
}
export class ATBaseline {
  name: string = ''
  label: string = ''
  testTime: number = 0
  minimumHour: number = 0
  deadline: number = 0
  simulationId: string = ''
  protocolIds: string[] = []
  instructionIds: string[] = []
  studyLogIds: string[] = []
  riskManagementIds: string[] = []
  attemptCount: number = 0
}

export class ATTraining {
  _id: string = ''
  name: string = ''
  label: string = ''
  protocolIds: string[] = []
  studyLogIds: string[] = []
  riskManagementIds: string[] = []
  domain: any
}
