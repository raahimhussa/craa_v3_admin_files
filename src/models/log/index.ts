import ILog, { LogScreen, Severity, SimEvent } from './types'

import IBookmark from '../bookmark/types'
import LogStore from 'src/stores/logStore'
import Note from '../note'
import { makeAutoObservable } from 'mobx'

export default class Log implements ILog {
  _id: any = ''
  screen: LogScreen = LogScreen.Baseline
  event: SimEvent = SimEvent.OnClickAddNote
  severity: Severity = Severity.Info
  duration: number = 0
  baselineId: string = ''
  message: string = 'empty string'
  createdAt: Date = new Date()
  updatedAt: Date = new Date()
  note: Note | null = null
  userSimulationId: any
  userId: any
  viewports?: any[]
  bookmark?: IBookmark
  store: LogStore
  recordId: string = ''
  constructor(store: LogStore, data: ILog) {
    makeAutoObservable(this)
    Object.assign(this, data)
    this.store = store
  }
}
