import { FindingStatus } from 'src/utils/status'
import { ISimDoc } from 'src/models/simDoc/types'

export enum FindingSeverity {
  Critical = 0,
  Major = 1,
  Minor = 2,
}

export default interface IFinding {
  _id: any
  visibleId: number
  text: string
  severity: FindingSeverity
  seq?: number
  cfr: string
  domainId: string
  ich_gcp: string
  simDocId: string | null
  simDocIds: string[]
  status: FindingStatus
  isDeleted?: boolean
  createdAt?: Date | null
  updatedAt?: Date | null
  domain?: any
  addedSimulationMappers?: any[]
  removedSimulationMappers?: any[]
  possibleCompareSimDocs?: any[]
}
