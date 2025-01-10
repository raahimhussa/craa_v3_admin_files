import { Dayjs } from 'dayjs'
import { IStore } from '../types'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import UserAssessmentCycleRepository from 'src/repos/v2/userAssessmentCycleRepository'
import { makeAutoObservable } from 'mobx'

export default class UserAssessmentCycleStore implements IStore {
  store: RootStore
  router: RouterStore
  repository: UserAssessmentCycleRepository
  userAssessmentCycle: UserAssessmentCycle | null = null
  userSimulationRepository: any
  form: any
  delete: any

  invoicedFromValue: Dayjs | null | undefined
  invoicedToValue: Dayjs | null | undefined

  invoicedMutate: any
  invoicedCountMutate: any
  notInvoicedMutate: any
  notInvoicedCountMutate: any
  constructor(
    store: RootStore,
    userAssessmentCycleRepository: UserAssessmentCycleRepository
  ) {
    this.store = store
    this.router = store.routerStore
    this.repository = userAssessmentCycleRepository
    makeAutoObservable(this)
  }

  loadData(data: any) {
    this.userAssessmentCycle = new UserAssessmentCycle(this)
    this.userAssessmentCycle.load(data)
  }
}
