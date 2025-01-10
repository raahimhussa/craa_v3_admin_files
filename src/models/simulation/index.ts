import { IModel } from '../types'
import ISimulation from 'src/models/simulation/simulation.interface'
import SimulationStore from 'src/stores/simulationStore/SimulationStore'
import { makeAutoObservable } from 'mobx'

export default class Simulation implements IModel, ISimulation {
  _id: any = null
  visibleId: number = -1
  name: string = ''
  label: string = ''
  simDocIds: string[] = []
  isDeleted: boolean = false
  updatedAt!: Date
  createdAt!: Date
  folderIds: string[] = []
  agreement: AnnouncementTemplate = {
    title: '',
    htmlContent: '',
    published: false,
  }
  onSubmission: AnnouncementTemplate = {
    title: '',
    htmlContent: '',
    published: false,
  }

  store: SimulationStore

  constructor(store: SimulationStore, data: ISimulation) {
    this.store = store
    Object.assign(this, data)
    makeAutoObservable(this, {
      store: false,
      _id: false,
    })
  }

  load(data: any) {
    Object.assign(this, data)
  }
}

export class AnnouncementTemplate {
  title!: string
  htmlContent!: string
  published!: boolean
}
