import { IScreenRecorder } from './IScreenRecorder'
import { extendObservable } from 'mobx'

export class ScreenRecorder implements IScreenRecorder {
  _id: string = ''
  recorders: string[] = []
  userSimulationId: string = ''
  isDeleted: boolean = false
  createdAt: Date = new Date()
  updatedAt: Date = new Date()

  constructor(data: IScreenRecorder) {
    extendObservable(this, data)
  }
}
