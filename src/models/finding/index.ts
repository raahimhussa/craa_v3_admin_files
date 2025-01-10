import IFinding, { FindingSeverity } from 'src/models/finding/finding.interface'

import { FindingStatus } from 'src/utils/status'
import FindingStore from 'src/stores/findingStore'
import { IModel } from '../types'
import { makeAutoObservable } from 'mobx'

export default class Finding implements IModel, IFinding {
  store: FindingStore
  _id: any = ''
  visibleId: number = -1
  text: string = ''
  severity: number = FindingSeverity.Major
  seq: number = 0
  cfr: string = ''
  ich_gcp: string = ''
  documents: any[] = []
  status: FindingStatus = FindingStatus.Active
  isDeleted: boolean = false
  createdAt: Date | null = null
  updatedAt: Date | null = null

  constructor(store: FindingStore, data: IFinding) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
    })
    Object.assign(this, data)
  }
  domainId!: string
  simDocId: string | null = null
  simDocIds: string[] = []

  load(data: any) {
    Object.assign(this, data)
  }
}
