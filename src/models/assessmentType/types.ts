export class ATFollowup {
  readonly _id: string = ''
  label: string = ''
  simulationId: string = ''
  testTime: number = 0
  minimumHour: number = 0
  deadline: number = 0
  protocolIds: string[] = []
  instructionIds: string[] = []
  studyLogIds: string[] = []
  riskManagementIds: string[] = []
}
export class ATBaseline {
  label: string = ''
  testTime: number = 0
  minimumHour: number = 0
  deadline: number = 0
  simulationId: string = ''
  protocolIds: string[] = []
  instructionIds: string[] = []
  studyLogIds: string[] = []
  riskManagementIds: string[] = []
}

export class ATTraining {
  _id: string = ''
  label: string = ''
  protocolIds: string[] = []
  studyLogIds: string[] = []
  riskManagementIds: string[] = []
}
