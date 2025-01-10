import IUserSimulation, {
  Result,
} from 'src/models/userSimulation/userSimulation.interface'

import { IStore } from '../types'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import UserSimulation from 'src/models/userSimulation'
import UserSimulationRepository from 'src/repos/v2/userSimulation'
import { UserSimulationStatus } from 'src/utils/status'
import { makeAutoObservable } from 'mobx'

export default class UserSimulationStore implements IStore {
  store: RootStore
  router: RouterStore
  repository: UserSimulationRepository
  userSimulation: UserSimulation | null = null
  userSimulationRepository: any
  form: IUserSimulation = {
    userId: '',
    assessmentTypeId: '',
    usageTime: 0,
    testTime: 0,
    results: new Result(),
    status: UserSimulationStatus.Assigned,
    attemptCount: 0,
    instructions: [],
    protocols: [],
    studyLogs: [],
    isDeleted: false,
    startedAt: 0,
  }
  delete: any
  constructor(
    store: RootStore,
    userSimulationRepository: UserSimulationRepository
  ) {
    this.store = store
    this.router = store.routerStore
    this.repository = userSimulationRepository
    makeAutoObservable(this)
  }

  loadData(data: any) {
    this.userSimulation = new UserSimulation(this)
    this.userSimulation.load(data)
  }
}
