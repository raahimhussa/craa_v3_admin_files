import { SimulationType, UserSimulationStatus } from 'src/utils/status'

import { IModel } from '../types'
import { Result } from './userSimulation.interface'
import { UserSimulationDoc } from './types'
import { makeAutoObservable } from 'mobx'
import userSimulationStore from 'src/stores/userSimulationStore'

export default class UserSimulation implements IModel {
  _id: string = ''
  userId: string = ''
  simulationType: SimulationType = SimulationType.None
  simulationId: string = ''
  domainId: string = ''
  minimumEffort: boolean = false
  unusualBehavior: boolean = false
  usageTime: number = 0
  testTime: number = 0
  minimumHour: number = 0
  deadline: number = 0
  status: UserSimulationStatus = UserSimulationStatus.InProgress
  attemptCount: number = 10
  instructions: UserSimulationDoc[] = []
  protocols: UserSimulationDoc[] = []
  studyLogs: UserSimulationDoc[] = []
  reopenCount: number = 0
  isDeleted: boolean = false
  results!: Result
  createdAt: number = Date.now()
  startedAt: number = Date.now()
  assignedAt: number = Date.now()
  submittedAt: number = Date.now()
  publishedAt: number = Date.now()
  distributedAt: number = Date.now()
  updatedAt: number = Date.now()
  store: userSimulationStore

  constructor(store: userSimulationStore) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
      _id: false,
    })
  }

  load(data: any) {
    Object.assign(this, data)
  }

  *changeStatus(status: UserSimulationStatus) {
    const body = {
      filter: {
        _id: this._id,
      },
      update: {
        status: status,
      },
    }
    yield this.store.userSimulationRepository?.update(body)
  }
}
